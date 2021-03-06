require('./config/config');
const express = require('express');
const app = express();
var mongoose = require('mongoose');

const bodyParser = require('body-parser');

// middlewares // parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

//se cargan las rutas
app.use(require('./routes/index'));

let options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false

};

mongoose.connect(process.env.MONGO_URI, options, (err, res) => {
    if (err) throw err;
    console.log("Base de datos Online ");
});

app.listen(process.env.PORT, () => {
    console.log("Escuchando por el puerto ", process.env.PORT);
});