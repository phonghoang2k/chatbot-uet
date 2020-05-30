// core
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const logger = require('morgan');
const axios = require('axios');
const xhub = require('express-x-hub');

//part
const router = require('./src/routes/router');
const facebook = require('./src/controllers/platform/facebook');

//custom
const config = require('./custom/config');
const language = require('./custom/language');

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

facebook.setupFacebookAPI(config.FB_PAGE_ACCESS_TOKEN);

// app.set('port', (process.env.PORT || config.PORT));
if (config.FB_APP_SECRET != '') {
    app.use(xhub({ algorithm: 'sha1', secret: config.FB_APP_SECRET }));
}
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