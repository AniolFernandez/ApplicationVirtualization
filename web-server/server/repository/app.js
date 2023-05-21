const db = require('../db');

function deleteAppRel(docker_image) {
    return new Promise((resolve, reject) => {
        try {
            db.query(`DELETE FROM role_has_app WHERE app_docker_image = ?`, [docker_image], (error, results) => {
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
}

function deleteApp(docker_image) {
    return new Promise((resolve, reject) => {
        try {
            db.query(`DELETE FROM app WHERE docker_image = ?`, [docker_image], (error, results) => {
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

function addApp(app) {
    return new Promise((resolve, reject) => {
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

function addAppRole(roleid, docker_image) {
    return new Promise((resolve, reject) => {
        db.query(`INSERT INTO role_has_app (role_id, app_docker_image)
                 VALUES (?, ?)`, [roleid, docker_image], (error, results) => {
            if (error) {
                console.error('Error al insertar rols d\'app la bdd:', error);
                reject();
            }
            resolve();
        });
    });
}

function getAppsWithRoles() {
    return new Promise((resolve, reject) => {
        db.query(`SELECT docker_image, name, logo, availableUnauth, availableAnyAuth, GROUP_CONCAT(t1.role_id) roles FROM app t0
                 LEFT JOIN role_has_app t1 ON t0.docker_image = t1.app_docker_image
                 GROUP BY docker_image, name, logo, availableUnauth, availableAnyAuth`
            , [catalog.repositories], (error, results) => {
                if (error) {
                    console.error('Error al consultar la bdd:', error);
                    reject();
                }
                resolve(results);
            });
    });
}

function getAppsWithAccess(user, role, isAdmin) {
    let query = 'SELECT DISTINCT docker_image, name, logo FROM app t0 ';
    if (!isAdmin)
        query = query + `LEFT JOIN role_has_app t1 ON t0.docker_image = t1.app_docker_image 
        WHERE availableUnauth = 1
        ${user ? 'OR availableAnyAuth = 1' : ''}
        ${role != null ? 'OR t1.role_id = ?' : ''}
        `;
    return new Promise((resolve, reject) => {
        db.query(query, [role], (error, results) => {
            if (error) {
                console.error('Error al consultar la bdd:', error);
                reject();
            }
            resolve(results);
        });
    });
}

function checkUserAppAuthorization(filter) {
    let query = `SELECT DISTINCT docker_image FROM app t0 
    LEFT JOIN role_has_app t1 ON t0.docker_image = t1.app_docker_image 
    WHERE docker_image = ? and (availableUnauth = 1
    ${filter.user ? 'OR availableAnyAuth = 1' : ''}
    ${filter.role != null ? 'OR t1.role_id = ?' : ''})
    `;
    return new Promise((resolve, reject) => {
        db.query(query, [filter.app, filter.role], (error, results) => {
            resolve(!error && results.length > 0);
        });
    });
}

module.exports = {
    deleteAppRel,
    deleteApp,
    addApp,
    addAppRole,
    getAppsWithRoles,
    getAppsWithAccess,
    checkUserAppAuthorization
}