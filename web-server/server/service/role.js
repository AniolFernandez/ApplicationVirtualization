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
        return results;
    },

    //Afegir rol
    afegirRol: async function (nom) {
        const id = await new Promise((resolve, reject) => {
            db.query(`SELECT coalesce(max(id)+1,0) id FROM role`, (error, results) => {
                if (error) {
                    console.error("Error al consultar la db: ", error);
                    reject('Error al consultar');
                }
                resolve(results[0].id);
            });
        });
        const ok = await new Promise((resolve, reject) => {
            db.query('INSERT INTO role (id, name) VALUES (?, ?);', [id, nom], (error, results) => {
                if (error) {
                    console.error("Error al crear rol: ", error);
                    reject('Error al crear rol');
                }
                resolve(results.affectedRows == 1);
            });
        });
        if (ok)
            return id;
        else
            return null;
    },

    //Eliminar rol
    deleteRoleById: async function (id) {
        return await new Promise((resolve, reject) => {
            db.query(`DELETE FROM role WHERE id = ?`, [id], (error, results) => {
                if (error) {
                    console.error("Error al eliminar el rol de la db: ", error);
                    resolve(false);
                }
                resolve(results.affectedRows > 0);
            });
        });
    },
}