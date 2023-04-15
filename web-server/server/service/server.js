const REFRESH = 10000; //10/min
const TIMEOUT = 60000; //1 min


//Estructura que manté l'status de cada servidor d'apps
const servers = {}

//Elimina els servidors d'applicacions que no es reportin en l'interval.
setInterval(() => {
    const now = Date.now();
    for (const ip in servers) {
        if (now - servers[ip] > TIMEOUT) {
            delete servers[ip];
            console.log(`Timeout per: ${ip}`);
        }
    }
}, REFRESH);

module.exports = {
    //Status d'un servidor
    keepalive: function (ip) {
        servers[ip] = Date.now();
    },
}