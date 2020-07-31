const express = require('express');
const crypto = require('crypto');
const connection = require('../../database/connection');
const routes = express.Router();

//Rota -> Listar usuarios *irá mudar pra trazer um só*
routes.get('/users', async (req, res) => {
    const users = await connection('users').select('*');
    //estou trazendo todos os usuarios, devo trazer só 1
    return res.json(users);
});

//Rota -> criação de usuários
routes.post('/users', async (req, res) => {
    const { email, password, name } = req.body;

    const id_user = crypto.randomBytes(4).toString('HEX');

    await connection('users').insert({ //users aqui no parametro é a tabela do banco
        id_user,
        name,
        email, 
        password, 
    })

    return res.json({id_user});
});

module.exports = routes;