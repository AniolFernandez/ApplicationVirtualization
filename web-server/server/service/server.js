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
        servers[ip.replace("127.0.0.1","192.168.56.101")] = {
            lastTick: Date.now(),
            ram: ram,
            cpu: cpu
        }
    },

    //Obtenció dels servidors actuals
    getServers: function () {
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

    //Obtenció dels servidors (per a usuaris)
    getServerIps: () => { return Object.keys(servers) },

    //Escollir servidor preferit
    chooseServer: function (llistatMs) {
        //Filtrem aquells servidors que tenen un temps de resposta acceptable
        const acceptables = llistatMs.filter(x => x.msToResponse < 250).map(x => x.server);

        //Obtenim servidor amb la major quantitat de ram disponible
        let servidorEscollit = null;
        acceptables.forEach((ip) =>{
            if (servers[ip] && (servidorEscollit==null || servers[ip].ram > servers[servidorEscollit].ram))
                servidorEscollit = ip;
        })

        return servidorEscollit;
    }
}