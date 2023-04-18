const REFRESH = 10000; //10/min
const TIMEOUT = 60000; //1 min


//Estructura que manté l'status de cada servidor d'apps
const servers = {};

//Elimina els servidors d'applicacions que no es reportin en l'interval.
setInterval(() => {
    const now = Date.now();
    for (const ip in servers) {
        if (now - servers[ip].lastTick > TIMEOUT) {
            delete servers[ip];
            console.log(`Timeout per: ${ip}`);
        }
    }
}, REFRESH);

module.exports = {
    //Status d'un servidor
    keepalive: function (ip, { ram, cpu }) {
        servers[ip] = {
            lastTick: Date.now(),
            ram: ram,
            cpu: cpu
        }
    },

    //Obtenció dels servidors actuals
    getServers: function(){
        svs = [];
        for (const ip in servers) {
            svs.push({
                ip: ip,
                cpu: servers[ip].cpu,
                ram: servers[ip].ram
            })
        }
        return svs;
    },

    getServerIps: () => {return Object.keys(servers)}
}