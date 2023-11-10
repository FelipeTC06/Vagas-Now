const axios = require('axios');
const cheerio = require('cheerio');
const connection = require('../../database/database');

async function fetchData(url) {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        throw new Error(`Erro ao obter a página: ${error}`);
    }
}

function extractJobInfo($) {
    return function (index, element) {
        const link = $(element).attr('href');
        const nome = $(element).find('h3').text().trim();
        const pay = $(element).find('span:has(i.far.fa-money-bill-alt)').text().trim();

        const tags = [];
        $(element).find('span.tag-list.background-gray').each((i, tagElement) => {
            tags.push($(tagElement).text().trim());
        });

        return { link, nome, tags, pay };
    };
}

async function getJobsFromDatabase() {
    return new Promise((resolve, reject) => {
        connection.query('SELECT link FROM jobs', (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

function compareArrays(dbJobs, scrapedJobs) {
    const dbLinks = dbJobs.map(job => job.link);
    const newJobs = scrapedJobs.filter(job => !dbLinks.includes(job.link));

    if (newJobs.length > 0) {
        console.log('Novos trabalhos encontrados:');
        return newJobs;
    } else {
        console.log('Nenhum novo trabalho encontrado.');
        return [];
    }
}

async function queryAsync(sql, values) {
    return new Promise((resolve, reject) => {
        connection.query(sql, values, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}



async function insertNewJobs(newJobs) {
    try {
        await queryAsync('START TRANSACTION');

        await queryAsync('DELETE FROM tags');

        for (const job of newJobs) {
            const insertJobResult = await queryAsync('INSERT INTO jobs SET ?', {
                link: job.link,
                nome: job.nome,
                pay: job.pay,
            });

            const jobId = insertJobResult.insertId;

            for (const tag of job.tags) {
                await queryAsync('INSERT INTO tags (job_id, tag) VALUES (?, ?)', [jobId, tag]);
            }
        }

        await queryAsync('COMMIT');

        console.log('Transação completa.');
    } catch (error) {
        await queryAsync('ROLLBACK');
        throw error;
    }
}


async function main(req, res) {
    const url = 'https://programathor.com.br/jobs';

    const html = await fetchData(url);
    const $ = cheerio.load(html);

    const links = $('a:has(h3 > span.new-label)');
    const resultArray = links.map(extractJobInfo($)).get();

    const dbJobs = await getJobsFromDatabase();

    const newJobs = compareArrays(dbJobs, resultArray);

    if (newJobs.length === 0) {
        res.status(200).send('Nenhum novo trabalho encontrado.');
    } else {
        await insertNewJobs(resultArray);
        res.status(200).json(newJobs);
    }
}

module.exports = main;