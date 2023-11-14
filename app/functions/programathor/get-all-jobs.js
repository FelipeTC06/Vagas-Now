const connection = require('../../database/database');

async function getJobsFromDatabase() {
    return new Promise((resolve, reject) => {
        const query = `
        SELECT j.*, GROUP_CONCAT(t.tag) AS tags
        FROM jobs AS j
        LEFT JOIN tags AS t ON j.id = t.job_id
        GROUP BY j.id;
      `;

        connection.query(query, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}



async function allJobs(req, res) {
    const jobs = await getJobsFromDatabase();

    if (jobs.length === 0) {
        return res.status(404).json({ error: 'Nenhum trabalho encontrado.' });
    }
    return res.json(jobs);

}

module.exports = allJobs;
