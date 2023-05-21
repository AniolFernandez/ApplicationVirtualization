const db = require('../db')

function getAllRoles() {
    return new Promise((resolve, reject) => {
        try {
            db.query(`SELECT id, name FROM role`, (error, results) => {
                if (error) {
                    console.error("Error al consultar la db: ", error);
                    reject('Error al consultar');
                    return;
                }
                resolve(results);
            });
        }
        catch {
            reject('Error al consultar');
        }
    });
}

function getNewId() {
    return new Promise((resolve, reject) => {
        try {
            db.query(`SELECT coalesce(max(id)+1,0) id FROM role`, (error, results) => {
                if (error) {
                    console.error("Error al consultar la db: ", error);
                    reject('Error al consultar');
                    return;
                }
                resolve(results[0].id);
            });
        }
        catch {
            reject('Error al consultar');
        }

    });
}

function addRole(id, name) {
    return new Promise((resolve, reject) => {
        try {
            db.query('INSERT INTO role (id, name) VALUES (?, ?);', [id, name], (error, results) => {
                if (error) {
                    console.error("Error al crear rol: ", error);
                    reject('Error al crear rol');
                }
                else
                    resolve(results.affectedRows == 1);
            });
        }
        catch {
            resolve(false);
        }
    });
}

function deleteRoleById(id) {
    return new Promise((resolve, reject) => {
        try {
            db.query(`DELETE FROM role WHERE id = ?`, [id], (error, results) => {
                if (error) {
                    console.error("Error al eliminar el rol de la db: ", error);
                    resolve(false);
                }
                else
                    resolve(results.affectedRows > 0);
            });
        }
        catch {
            resolve(false);
        }
    });
}

function updateRole({name, id}){
    return new Promise((resolve, reject) => {
        try{
            db.query(`UPDATE role SET name = ? WHERE id = ?`, [name, id], (error, results) => {
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
}

module.exports = {
    getAllRoles,
    getNewId,
    addRole,
    deleteRoleById,
    updateRole
}