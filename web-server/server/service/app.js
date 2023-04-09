const db = require('../db');

module.exports = {
    //Obtenir apps per a la seva configuruació 
    getAppsForConfig: async function () {
        //Obtenim totes les apps del cataleg
        const catalog = await (await fetch(`http://${process.env.REGISTRY_HOST || '192.168.56.101:5000'}/v2/_catalog`)).json();

        //Diccionari marcant quines apps del cataleg son noves
        const appsCataleg = {};
        if (catalog.repositories)
            catalog.repositories.map(app => appsCataleg[app] = {
                docker_image:app, pendingConfig:true,
                name:'',logo:'',availableAnyAuth: true, availableUnauth: true, roles: []
            });//Inicialment totes son noves

        //Marquem i emplenem aquelles del cataleg que ja tenim registrades
        await new Promise((resolve, reject) => {
            db.query(`SELECT docker_image, name, logo, availableUnauth, availableAnyAuth, GROUP_CONCAT(t1.role_id) roles FROM app t0
                     LEFT JOIN role_has_app t1 ON t0.docker_image = t1.app_docker_image
                     GROUP BY docker_image, name, logo, availableUnauth, availableAnyAuth`
                     , [catalog.repositories], (error, results) => {
                if (error) {
                    console.error('Error al consultar la bdd:', error);
                    reject();
                }
                else {
                    results.forEach(app => {
                        if(app.docker_image in appsCataleg){
                            appsCataleg[app.docker_image].pendingConfig= false;
                            appsCataleg[app.docker_image].name= app.name;
                            appsCataleg[app.docker_image].logo= app.logo;
                            appsCataleg[app.docker_image].availableUnauth= app.availableUnauth;
                            appsCataleg[app.docker_image].availableAnyAuth= app.availableAnyAuth;
                            appsCataleg[app.docker_image].roles = app.roles ? app.roles : [];
                        }
                    })
                }
            });
            resolve();
        });

        //retornem les imatges
        return Object.values(appsCataleg);
    },
}