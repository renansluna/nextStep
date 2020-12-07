const crypto = require('crypto');
const connection = require('../../../database/connection');
//CRIAR TRATAMENTO PARA USUARIO NAO EXISTENTE
module.exports = {

    async index (req, res) {
    
        const users = await connection('users').select('*')
        
        
        return res.json(users);
    },


    async login (req, res) {
        const { email, password } = req.body;
        let isLoginRight = false;

        const user = await connection('users').select('*').where('email', email);

        if (user[0].email === email && user[0].password === password){
            isLoginRight = true;
        }
        
        return res.json(user);
    },

    async create (req, res) {
        console.log(req.body);
        const { name, email, password } = req.body;

        const id_user = crypto.randomBytes(4).toString('HEX');
    
        await connection('users').insert({ //users aqui no parametro é a tabela do banco
            id_user,
            name,
            email, 
            password
        })
    
        return res.json({id_user});
    }

}