const crypto = require('crypto');
const connection = require('../../../database/connection');

module.exports = {
    /*
    async index (req, res) {
        const users = await connection('users').select('*');
        //estou trazendo todos os usuarios, devo trazer só 1
        return res.json(users);
    },
*/

    async index (req, res) {
        
        const markers = await connection('markers').select('*')
        
        return res.json(markers);
    },

    async create (req, res) {
        console.log(req.body);
        const { latitude, longitude, street, description, fk_id_user } = req.body;
        console.log('street: ' + street);
        
        // const fk_ id_user = Usuário LOGADO
        const id_marker = crypto.randomBytes(4).toString('HEX');
        await connection('markers').insert({ //users aqui no parametro é a tabela do banco
            id_marker,
            latitude,
            longitude, 
            street,
            description, 
            fk_id_user
        })
    
        return res.json({id_marker});
    },

    async delete (req, res) {
        const {id_marker} = req.params;
        console.log(id_marker);
        await connection('markers').where('id_marker', id_marker).delete();
        
        return res.json(true);
    }
/*
    async deleteAll (req, res) {

        await connection('markers').del();
        
        return 'deleted';
    }
*/
}

/*
        table.string('id_marker', 255).primary();
        table.string('latitude', 255).notNullable();
        table.string('longitude', 255).notNullable();
        table.string('description', 255).notNullable();
        table.string('fk_id_user').unsigned();
        table.foreign('fk_id_user').references('id_user').inTable('users');
*/