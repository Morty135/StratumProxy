const net = require('net');
const fs = require('fs');

const settingsPath = 'settings.json';
const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));



//CreatesSocketForEveryRig
const proxyServer = net.createServer(function (rigSocket)  
{
    var poolSocket;
    //CreatesSocketForPool
    try
    {
        poolSocket = net.createConnection(settings.poolPort, settings.poolURL);
    }
    catch
    {
        console.log("Couldn't connect to pool, check the port and address in settings.json.");
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
            }
            catch (error) 
            {
                console.log("Data fromat differs from expected format, failed to decode: " + error);
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
            }
            catch (error) 
            {
                console.log("Data fromat differs from expected format, failed to decode: " + error);
            }
        })

    }
});

proxyServer.listen(settings.proxyPort, () => {
    console.log(`Stratum proxy is listening on port ${settings.proxyPort}`);
});