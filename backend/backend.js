// Dependencies
let requestPromise = require('request-promise');
let express = require('express');
let os = require('os');
let parseString = require('xml2js').parseString;
let mongoose = require('mongoose');
let redis = require('redis');
let cors = require('cors');
let prometheusClient = require('prom-client');

let app = express();
app.use(cors())
// Port at which the backend is listening
let port = 6000;
// URL to fetch data
let url = 'http://www.meteoromania.ro/anm/prognoza-orase-xml.php';
let database_uri = 'mongodb://mongo:27017/docker-node-mongo';
let redisClient = redis.createClient( { 
        port      : 6379,
        host      : 'redis'});

let registeredMetrics = new prometheusClient.Registry();
prometheusClient.collectDefaultMetrics();
// Fetch every 5 seconds

const collectDefaultMetrics = prometheusClient.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

const counter = new prometheusClient.Counter({
    name: "requests_count",
    help: "The total number of processed requests."
});

const histogram = new prometheusClient.Histogram({
    name: "requests_histogram",
    help: "Histogram for processed requests.",
    buckets: [1, 2, 5, 6, 10],
});


let WeatherTable = require('./models/WeatherModel');
let CovidTable = require('./models/CovidModel');
const { start } = require('repl');
const { resolve } = require('path');
const { update } = require('./models/WeatherModel');

mongoose
    .connect(database_uri, { useNewUrlParser: true })
    .then(() => console.log("Successfully connected to the database"))
    .catch(error => console.log('NU MERGEEE!!!!!'));

redisClient.on("error", function(error) {
    console.error(error)
});  

app.get("/getWeatherData", (req, res) => {
    var begin = new Date();

                   
    redisClient.get("getWeatherData/" + req.query.county, function(err, reply) {
        if (reply === null) {
            var dbQuery = { county: req.query.county};
            WeatherTable.find(dbQuery).exec(function(error, dbResponse) {
                if (dbResponse.length > 0) {
                    res.send(dbResponse)
                } else {
                    requestPromise(url)
                        .then(function (weather) {
                            parseString(weather, function(err, weatherObject) {
                                const localitati = weatherObject.Prognoza_AdmNatMeteorologie_Romania.tara[0].localitate;
                                let foundCounty = false;
                                
                                for (let i = 0; i < localitati.length; i++) {
                                    if(localitati[i].$.nume === req.query.county) {
                                        var updateDoc = {
                                            $set: {
                                              county: localitati[i].$.nume,
                                              data : localitati[i].prognoza,
                                            },
                                        };
                                        const newW = new WeatherTable(JSON.stringify(insertDoc));
                                        newW.save()
                                        redisClient.set("getWeatherData/" + req.query.county, JSON.stringify(localitati[i].prognoza));
                                        res.send(localitati[i].prognoza);
                                        foundCounty = true;
                                        break;
                                    }
                                }
                                if (foundCounty === false) {
                                    res.send({});
                                }
                                histogram.observe((new Date() - begin) / 1000); // in seconds
                                counter.inc();
                            });
                        })
                        .catch(function (error) {
                            res.send({error})
                        });
    
                }
            });
        } else {
            histogram.observe((new Date() - begin) / 1000); // in seconds
            counter.inc();
            res.send(reply)
        }
    });
                
             
});

app.get("/getCovidData", (req, res) => {
    redisClient.get("getCovidData/" + req.query.county, function(err, reply) {
        if (reply === null) {
            var dbQuery = { county: req.query.county};
            CovidTable.find(dbQuery).exec(function(error, dbResponse) {
                if (dbResponse.length > 0) {
                    res.send(dbResponse)
                } else {
                    requestPromise('https://raw.githubusercontent.com/ec-jrc/COVID-19/master/data-by-region/jrc-covid-19-regions-latest.csv')
                        .then(function(data) {
                            let data_rows = data.split("\n");
                            data_rows = data_rows.filter(x => x.includes('Romania'))
                            let searchCounty = req.query.county;
                            if (searchCounty === 'Constanța') {
                                searchCounty = 'Costanza';
                            }
                            data_rows = data_rows.filter(x => x.includes(searchCounty))
                            let value =  data_rows[0].split(",")[6];
                            redisClient.set("getCovidData/" + req.query.county, value);
                            counter.inc();
                            res.send({'covidCases' : value});
                        })
                        .catch(function (error) {
                            res.send({error})
                        });
                }
            });
        } else {
            counter.inc();
            res.send({'covidCases' : reply});
        }
    });
});

// Metrics endpoint
app.get("/metrics", (req, res) => {


  res.set('Content-Type', prometheusClient.register.contentType)
  res.end(prometheusClient.register.metrics())
});

app.listen(port, () => console.log(`Backend started on port ${port}!`));
