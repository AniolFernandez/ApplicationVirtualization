const appRepository = require('../repository/app');

purgeAppData = async function (app) {
    //Eliminem totes les dades de les relacions existents
    await appRepository.deleteAppRel(app.docker_image);

    //Eliminem dades de l'app
    await appRepository.deleteApp(app.docker_image);
}

insertApp = async function (app) {
    await appRepository.addApp(app);
}

insertAppRoles = async function (app) {
    app.roles.map(async x => {
        await appRepository.addAppRole(x,app.docker_image);
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
        const results = await appRepository.getAppsWithRoles();
        results.forEach(app => {
            if (appsCataleg[app.docker_image]) {
                appsCataleg[app.docker_image].pendingConfig = false;
                appsCataleg[app.docker_image].name = app.name;
                appsCataleg[app.docker_image].logo = app.logo;
                appsCataleg[app.docker_image].availableUnauth = app.availableUnauth.toString() === '1';
                appsCataleg[app.docker_image].availableAnyAuth = app.availableAnyAuth.toString() === '1';
                appsCataleg[app.docker_image].roles = app.roles ? app.roles.split(',').map(x => parseInt(x)) : [];
            }
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

        const results = await appRepository.getAppsWithAccess(filter.user, filter.role, filter.isAdmin);
        results.forEach(app => {
            if (appsCataleg[app.docker_image]) {
                filteredApps.push({
                    image: app.docker_image,
                    name: app.name,
                    ico: app.logo
                })
            }
        });

        //retornem les imatges
        return filteredApps;
    },

    //Comprova si es té accés a una app
    checkAuthorization: async function (filter) {
        //Si és admin té accés a tot
        if(filter.isAdmin) return true;

        //Si no és admin comprovem que l'applicació estigui disponible
        return await appRepository.checkUserAppAuthorization(filter);
    },
}