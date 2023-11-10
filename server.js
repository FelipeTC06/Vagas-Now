const express = require('express');
const cors = require('cors');
const router = require('./app/routes/routes');
const port = 3000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(router);

app.listen(port, () => {
    console.log(`Servidor iniciado na porta ${port}`);
  });
