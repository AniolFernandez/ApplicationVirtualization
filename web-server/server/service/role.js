const db = require('../db');

module.exports = {
    //Obtenció llistat de rols
    getRoles: async function () {
        const results = await new Promise((resolve, reject) => {
            try{
                db.query(`SELECT id, name FROM role`, (error, results) => {
                    if (error) {
                        console.error("Error al consultar la db: ", error);
                        reject('Error al consultar');
                        return;
                    }
                    resolve(results);
                });
            }
            catch{
                reject('Error al consultar');
            }
        });
        return results;
    },

    //Afegir rol
    afegirRol: async function (nom) {
        const id = await new Promise((resolve, reject) => {
            try{
                db.query(`SELECT coalesce(max(id)+1,0) id FROM role`, (error, results) => {
                    if (error) {
                        console.error("Error al consultar la db: ", error);
                        reject('Error al consultar');
                        return;
                    }
                    resolve(results[0].id);
                });
            }
            catch{
                reject('Error al consultar');
            }

        });
        const ok = await new Promise((resolve, reject) => {
            try{
                db.query('INSERT INTO role (id, name) VALUES (?, ?);', [id, nom], (error, results) => {
                    if (error) {
                        console.error("Error al crear rol: ", error);
                        reject('Error al crear rol');
                    }
                    else
                        resolve(results.affectedRows == 1);
                });
            }
            catch{
                resolve(false);
            }
        });
        if (ok)
            return id;
        else
            return null;
    },

    //Eliminar rol
    deleteRoleById: async function (id) {
        return await new Promise((resolve, reject) => {
            try{
                db.query(`DELETE FROM role WHERE id = ?`, [id], (error, results) => {
                    if (error) {
                        console.error("Error al eliminar el rol de la db: ", error);
                        resolve(false);
                    }
                    else
                        resolve(results.affectedRows > 0);
                });
            }
            catch{
                resolve(false);
            }
        });
    },

    //Actualitzar rol
    editarRol: async function (role) {
        return await new Promise((resolve, reject) => {
            try{
                db.query(`UPDATE role SET name = ? WHERE id = ?`, [role.name, role.id], (error, results) => {
                    if (error) {
                        console.error("Error al editar rol: ", error);
                        resolve(false);
                    }
                    else
                        resolve(results.affectedRows > 0);
                });
            }
            catch{
                resolve(false);
            }
            
        });
    },
}