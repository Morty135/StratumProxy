# Stratum Proxy
## Setup:
1. download nodeJS (the proxy is tested on node v18.15.0)
2. Use npm to install the net dependency if needed.
3. set your preferred parameters in settings.json to connect to your favorite pool.
4. start the proxy with node src/proxy.js
5. connect your miners to the proxy with your.proxy.computer.ip:your.proxy.port and leave the rest of the miner settings as if you were connecting directly to the pool.

## Example config for lolminer on alephium:


![image](https://github.com/Morty135/StratumProxy/assets/59707384/af9fcc8f-2b72-48b1-b5cf-aac51515b1f7)
![image](https://github.com/Morty135/StratumProxy/assets/59707384/503eeac1-386f-487b-be52-e1201721fc29)

## ToDo
1. finish webui start stop functionality
2. add traffic log to webui
3. improve the visual of the webui
4. set it up for docker