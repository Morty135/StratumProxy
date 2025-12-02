const net = require('net');
const fs = require('fs');
const { timeStamp } = require('console');

const settingsPath = 'settings.json';
const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));

let proxyServer = null;

let logs = [];
let connections = new Set();

function addLog(message) {
    const timestamp = Date.now();
    const logEntry = `time: ${timestamp} ${message}`;
    logs.push(logEntry);

    if (logs.length > 500) logs.shift();
}



function startServer()
{
    //CreatesSocketForEveryRig
    proxyServer = net.createServer(function (rigSocket)  
    {
        connections.add(rigSocket); // track connection
        rigSocket.on('close', () => connections.delete(rigSocket));
        var poolSocket;
        //CreatesSocketForPool
        try
        {
            poolSocket = net.createConnection(settings.poolPort, settings.poolURL);
        }
        catch
        {
            console.log("Couldn't connect to pool, check the port and address in settings.json.");
            addLog("Failed to connect to pool.");
            return;
        }

        rigSocket.pipe(poolSocket);
        poolSocket.pipe(rigSocket);



        
        //console log traffic between miner and pool (for research and debug purposes only)
        if(settings.logTraffic == true)
        {
            rigSocket.on('data', function(data)
            {
                console.log("raw data from rig: " + data);
                try 
                {
                    jsonString = data.toString('utf8');
                    rigData = JSON.parse(jsonString);
                    console.log("decoded data from rig:" + rigData);
                    addLog("rig: " + JSON.stringify(rigData));
                    fs.appendFileSync('traffic.log'," rig: " + JSON.stringify(rigData) + '\n');
                }
                catch (error) 
                {
                    console.log("Data fromat differs from expected format, failed to decode: " + error);
                    addLog("rig error: " + error);
                }
            })

            poolSocket.on('data', function(data)
            {
                console.log("raw data from pool: " + data);
                try 
                {
                    jsonString = data.toString('utf8');
                    poolData = JSON.parse(jsonString);
                    console.log("decoded data from rig:" + poolData);
                    addLog("pool: " + JSON.stringify(poolData));
                    fs.appendFileSync('traffic.log'," pool: " + JSON.stringify(poolData) + '\n');
                }
                catch (error) 
                {
                    console.log("Data fromat differs from expected format, failed to decode: " + error);
                    addLog("pool error: " + error);
                    fs.appendFileSync('traffic.log'," pool error: " + error + '\n');
                }
            })

        }
    });

    proxyServer.listen(settings.proxyPort, () => {
        console.log(`Stratum proxy is listening on port ${settings.proxyPort}`);
    });
}



function stopServer()
{
    if (!proxyServer || !proxyServer.listening) 
    {
        return "error";
    }
    connections.forEach((socket) => socket.destroy());
    connections.clear();

    proxyServer.close(() => {
        console.log('Proxy server stopped.');
        proxyServer = null;
    });
    return "server stopped";
}



function getLogs() {
    return logs;
}



module.exports = { startServer, stopServer, getLogs };