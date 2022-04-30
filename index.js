require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const morganEnv = process.env.ENVIRONMENT === 'production' ? 'tiny' : 'dev';
const port = process.env.PORT || 4242;

app.use(cors());
app.use(helmet());
app.use(morgan(morganEnv));
app.use(express.json());

app.listen(port, () => {
    console.log(`Sever running at http://localhost:${port}`);
});

app.get('/', (req, res) => {
    res.json({
        message: 'Hello from root route',
    });
});
