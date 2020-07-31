const knex = require('knex');
const configuration = require('../../knexfile.js'); //importar configuracao do bd

const connection = knex(configuration.development);

module.exports = connection; //exporta a conexão

// connection deve ser importardo em todos os arquivos que comunicarão com o banco de dados