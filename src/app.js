const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const routes = require('./routes');

const app = express();

// Middlewares básicos
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuração do Handlebars
app.engine('handlebars', exphbs.engine({
  defaultLayout: 'main',
  extname: '.handlebars',
  layoutsDir: path.join(__dirname, 'views', 'layouts'),
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Assets estáticos
app.use(express.static(path.join(__dirname, '..', 'public')));

// Rotas
app.use('/', routes);

module.exports = app;