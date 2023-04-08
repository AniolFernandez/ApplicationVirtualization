const db = require('../db');

module.exports = {
    //Existeix usuari 
    getUnregisteredApps: async function () {
        //Obtenim totes les apps del cataleg
        const catalog = await (await fetch(`http://${process.env.REGISTRY_HOST || '192.168.56.101:5000'}/v2/_catalog`)).json();
        if (catalog.repositories) {

            //Diccionari marcant quines hi son
            const appsCataleg = {};
            catalog.repositories.map(app => appsCataleg[app] = false);//Inicialment no n'hi ha cap

            //Marquem aquelles del cataleg que ja tenim registrades
            await new Promise((resolve, reject) => {
                db.query('SELECT docker_image FROM app', [catalog.repositories], (error, results) => {
                    if (error) {
                        console.error('Error al consultar la bdd:', error);
                        reject();
                    }
                    else {
                        results.forEach(app => {
                            appsCataleg[app.docker_image] = true;
                        })
                    }
                });
                resolve();
            });

            //retornem aquelles que son noves
            const novesImatges = [];
            for (const [key, value] of Object.entries(appsCataleg)) {
                if(!value) novesImatges.push(key);
            }

            return novesImatges;
        }
        else return [];
    },
}