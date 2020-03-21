// core
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const logger = require('morgan');

//part
const router = require('./src/routers/router');

//custom
const config = require('./custom/config');

var app = express();

mongoose.connect(config.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

var conn = mongoose.connection;

conn.once('open', function () {
    console.log('connected mongodb');
});

// app.set('port', (process.env.PORT || config.PORT));
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ limit: '5mb', extended: false }));
app.use(bodyParser.json({ limit: '5mb' }));
app.use(cors());


app.use('/webhook', router);

app.get('/', (req, res) => {
    res.send(req.body);
});

app.listen(config.PORT, () => {
    console.log("Server is running at -> http://localhost:" + config.PORT);
})