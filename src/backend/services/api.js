const express = require('express');
const routes = require('./nodeRoutes');
const app = express();
app.use(express.json()); //faz funcionar o request.body em JSON

app.use(routes);

app.listen(3333);