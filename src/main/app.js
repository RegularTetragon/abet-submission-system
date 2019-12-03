const express = require('express');
const helmet = require('helmet');
const mustacheExpress = require('mustache-express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');
const session = require('express-session')

// init objection
require('./common/objection')

// init express
var app = express();

var project_root = path.join(__dirname, '../..')

app.engine('html', mustacheExpress())

app.set('view engine', 'html')
app.set('views', path.join(__dirname, 'views'))

app.use(helmet())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
	extended: false
}));
app.use(cookieParser());
app.use(session({
  'secret' : '03fi7i733sdnHhPCPTlGXw=='
}))
app.use(sassMiddleware({
  src: path.join(project_root, 'public/scss'),
  dest: path.join(project_root, 'public/css'),
  indentedSyntax: false,
  sourceMap: true
}));
app.use(express.static(path.join(project_root, 'public')));

app.use('/', require('./routes/index'))
app.use('/login', require('./routes/login'));
app.use('/course', require('./routes/course'));
app.use('/permissions', require ('./routes/permissions'));

module.exports = app;
