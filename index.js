require('dotenv').config();

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();
const morganEnv = process.env.ENVIRONMENT === 'production' ? 'tiny' : 'dev';
const port = process.env.PORT || 4242;
const riotApiKey = process.env.RIOT_API;
const baseRegionURL = process.env.BASE_REGION_URL || 'br1.api.riotgames.com';
const baseSummonerURL = process.env.BASE_SUMMONER_URL;


app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan(morganEnv));

app.listen(port, () => {
    console.log(`Sever running at http://localhost:${port}`);
});

app.get('/', (req, res) => {
    res.json({
        message: 'Hello from root route',
    });
});

app.get('/api/riot/:summonerName', async (req, res) => {
    const { summonerName } = req.params;
    const playerInfo = await getSummonerInfo(summonerName);
    const playerLeagueInfo = await getPlayerLeagueRanksInfo(playerInfo.id);

    return res.json({
        Informações: playerInfo,
        PlayerRankedInfos: playerLeagueInfo,
    });
});


function getPlayerIUD(summonerName) {
    return axios.get(`${baseSummonerURL}${summonerName}?api_key=${riotApiKey}`
    ).then(response => {
        return response.data.puuid;
    })
        .catch(error => {
            return res.json({
                stack: error.stack,
                code: error.code,
            });
        });
}

function getSummonerInfo(summonerName) {
    return axios.get(`${baseSummonerURL}${summonerName}?api_key=${riotApiKey}`
    ).then(response => {
        const { id, puuid, name } = response.data
        return { id, puuid, name };
    })
        .catch(error => {
            return res.json({
                stack: error.stack,
                code: error.code
            });
        });
}

function getPlayerLeagueRanksInfo(playerID) {
    return axios.get(`https://br1.api.riotgames.com/lol/league/v4/entries/by-summoner/${playerID}?api_key=${riotApiKey}`)
        .then(response => {
            return response.data;
        })
        .catch(error => { error });
}
