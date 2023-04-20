const db = require('../db');

purgeAppData = async function (app) {
    //Eliminem totes les dades de les relacions existents
    await new Promise((resolve, reject) => {
        try {
            db.query(`DELETE FROM role_has_app WHERE app_docker_image = ?`, [app.docker_image], (error, results) => {
                if (error) {
                    console.error('Error a l\'eliminar relacions existents:', error);
                    reject();
                }
                resolve();
            });
        }
        catch (err) {
            console.error('Error a l\'eliminar relacions existents:', err);
        }
    });

    //Eliminem dades de l'app
    await new Promise((resolve, reject) => {
        try {
            db.query(`DELETE FROM app WHERE docker_image = ?`, [app.docker_image], (error, results) => {
                if (error) {
                    console.error('Error a l\'eliminar dades existens de l\'app:', error);
                    reject();
                }
                resolve();
            });

        }
        catch (err) {
            console.error('Error a l\'eliminar relacions existents:', err);
        }
    });
}

insertApp = async function (app) {
    await new Promise((resolve, reject) => {
        db.query(`INSERT INTO app (docker_image, name, logo, availableUnauth, availableAnyAuth) 
            VALUES (?, ?, ?, ?, ?)`, [app.docker_image, app.name, app.logo, app.availableUnauth, app.availableAnyAuth], (error, results) => {
            if (error) {
                console.error('Error al insertar app la bdd:', error);
                reject();
            }
            resolve();
        });
    });
}

insertAppRoles = async function (app) {
    app.roles.map(async x => {
        await new Promise((resolve, reject) => {
            db.query(`INSERT INTO role_has_app (role_id, app_docker_image)
                     VALUES (?, ?)`, [x, app.docker_image], (error, results) => {
                if (error) {
                    console.error('Error al insertar rols d\'app la bdd:', error);
                    reject();
                }
                resolve();
            });
        });
    });
}

module.exports = {
    //Obtenir apps per a la seva configuruació 
    getAppsForConfig: async function () {
        //Obtenim totes les apps del cataleg
        const catalog = await (await fetch(`http://${process.env.REGISTRY_HOST || '192.168.56.101:5000'}/v2/_catalog`)).json();

        //Diccionari marcant quines apps del cataleg son noves
        const appsCataleg = {};
        if (catalog.repositories)
            catalog.repositories.map(app => appsCataleg[app] = {
                docker_image: app, pendingConfig: true,
                name: '', logo: '', availableAnyAuth: true, availableUnauth: true, roles: []
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
                            if (appsCataleg[app.docker_image]) {
                                appsCataleg[app.docker_image].pendingConfig = false;
                                appsCataleg[app.docker_image].name = app.name;
                                appsCataleg[app.docker_image].logo = app.logo;
                                appsCataleg[app.docker_image].availableUnauth = app.availableUnauth.toString() === '1';
                                appsCataleg[app.docker_image].availableAnyAuth = app.availableAnyAuth.toString() === '1';
                                appsCataleg[app.docker_image].roles = app.roles ? app.roles.split(',').map(x => parseInt(x)) : [];
                            }
                        })
                    }
                    resolve();
                });
        });

        //retornem les imatges
        return Object.values(appsCataleg);
    },

    //Actualització del cataleg
    updateCatalog: async function (app) {
        await purgeAppData(app);
        await insertApp(app);
        await insertAppRoles(app);
    },


    //Obtenir apps disponibles per a una sessió
    getApps: async function (filter) {
        //Obtenim totes les apps del cataleg
        const catalog = await (await fetch(`http://${process.env.REGISTRY_HOST || '192.168.56.101:5000'}/v2/_catalog`)).json();

        //Diccionari marcant quines apps existeixen al cataleg
        const appsCataleg = {};
        if (catalog.repositories)
            catalog.repositories.map(app => appsCataleg[app] = true);


        //Llista amb les apps que l'usuari pot veure i son al cataleg.
        const filteredApps = [];

        //Fetching de les apps a les que tenim accés
        let query = 'SELECT DISTINCT docker_image, name, logo FROM app t0 ';
        if(!filter.isAdmin)
            query = query + `LEFT JOIN role_has_app t1 ON t0.docker_image = t1.app_docker_image 
            WHERE availableUnauth = 1
            ${filter.user?'OR availableAnyAuth = 1':''}
            ${filter.role!=null?'OR t1.role_id = ?':''}
            `;
        await new Promise((resolve, reject) => {
            db.query(query, [filter.role], (error, results) => {
                    if (error) {
                        console.error('Error al consultar la bdd:', error);
                        reject();
                    }
                    else {
                        results.forEach(app => {
                            if (appsCataleg[app.docker_image]) {
                                filteredApps.push({
                                    image: app.docker_image,
                                    name: app.name,
                                    ico: app.logo
                                })
                            }
                        })
                    }
                    resolve();
                });
        });

        //retornem les imatges
        return filteredApps;
    },

    //Comprova si es té accés a una app
    checkAuthorization: async function (filter) {
        //Si és admin té accés a tot
        if(filter.isAdmin) return true;

        let canAccess = false;
        
        //Si no és admin comprovem que l'applicació estigui disponible
        let query = `SELECT DISTINCT docker_image FROM app t0 
                    LEFT JOIN role_has_app t1 ON t0.docker_image = t1.app_docker_image 
                    WHERE docker_image = ? and (availableUnauth = 1
                    ${filter.user?'OR availableAnyAuth = 1':''}
                    ${filter.role!=null?'OR t1.role_id = ?':''})
                    `;
        await new Promise((resolve, reject) => {
            db.query(query, [filter.app, filter.role], (error, results) => {
                    canAccess = !error && results.length>0;
                    resolve();
                });
        });

        return canAccess;
    },
}