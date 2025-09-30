const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

const settingsPath = 'settings.json';
const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));

const proxy = require('./proxy.js');

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



app.get('/', (req, res) => {
    res.render('index', { settings: settings });
})



app.post('/update', (req, res) => {
    const { pool_address, pool_port, proxy_port } = req.body;
    
    settings.poolURL = pool_address;
    settings.poolPort = parseInt(pool_port);
    settings.proxyPort = parseInt(proxy_port);

    fs.writeFileSync(settingsPath, JSON.stringify(settings));
    res.render('index', { settings: settings, status: "config updated" });
})



app.post('/start', (req, res) => {
    proxy.startServer;
    res.render('index', { settings: settings, status: "server started" });
})



app.post('/stop', (req, res) => {
    proxy.stopServer;
    res.render('index', { settings: settings, status: "server stopped" });
})



app.listen(port, () => {
    console.log(`Web listening on port ${port}`)
})
