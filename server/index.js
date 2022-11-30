const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { Sequelize } = require('sequelize');

var corsMiddleware = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, PUT, PATCH, POST, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Authorization, Origin');

    next();
}

const sequelize = new Sequelize(process.env.PSQL_SERVER, process.env.PSQL_USER, process.env.PSQL_PASS, {
    host: process.env.HOST,
    dialect: 'postgres'
});

// const Jyh = require('./models/JyhModel')(sequelize);
// const Output = require('./models/QueryOutputModel')(sequelize);
const Test = require('./models/TestPostModel')(sequelize);

async function connectToPg() {
    try {
        await sequelize.authenticate();
        console.log('Connection works!');
    } catch(error) {
        console.log("Connection failed :(");
    }
};

connectToPg();

sequelize.sync();

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(corsMiddleware);

// app.use(cors());

app.get('/', async (req, res) => { 
    const sauces = await Test.findAll()
        console.log(sauces);
        res.json(sauces);
});

const port = process.env.DEV_PORT;
app.listen(port, () => console.log(`Server running on port ${port}, http://localhost:${port}`));