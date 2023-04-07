const db = require('../db');

module.exports = {
    //Obtenció llistat de rols
    getRoles: async function () {
        const results = await new Promise((resolve, reject) => {
            db.query(`SELECT id, name FROM role`, (error, results) => {
                if (error) {
                    console.error("Error al consultar la db: ", error);
                    reject('Error al consultar');
                }
                resolve(results);
            });
        });
        
        //Diccionari de rols id -> nom
        const roles = {}
        results.forEach(result => {
            roles[result.id] = result.name
        });
        return roles;
    },
}