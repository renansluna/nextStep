const express = require('express');
const routes = express.Router();
const userController = require('./controllers/userController');
const markerController = require('./controllers/markerController');
//Rota -> Listar usuarios *irá mudar pra trazer um só*
routes.get('/users', userController.index);

//Rota -> Login de usuários
routes.post('/userLogin', userController.login);

//Rota -> criação de usuários
routes.post('/users', userController.create);

//Rota -> Salvar markers
routes.post('/marker', markerController.create);

//Rota -> Listar markers
routes.get('/marker', markerController.index);

//Rota -> Deletar markers
routes.delete('/deleteMarker/:id_marker', markerController.delete);
/*
//Rota -> Deletar todos os markers
routes.post('/deleteAllMarkers', markerController.deleteAll);
*/
module.exports = routes;