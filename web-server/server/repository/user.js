const db = require('../db')


function countUsernamesAndPassword(username, password) {
    return new Promise((resolve, reject) => {
        db.query('SELECT count(*) as count FROM user WHERE username = ? and password = ?', [username, password], (error, results) => {
            if (error) {
                console.error('Error al consultar la bdd:', error);
                reject('Error al consultar la bdd');
            }
            resolve(results);
        });
    });
}

function countUsernames(username){
    return new Promise((resolve, reject) => {
        db.query('SELECT count(*) as count FROM user WHERE username = ?', [username], (error, results) => {
            if (error) {
                console.error('Error al consultar la bdd:', error);
                reject('Error al consultar la bdd');
            }
            resolve(results);
        });
    });
}

function addUser(username, email, password){
    return new Promise((resolve, reject) => {
        db.query('INSERT INTO user (username, email, password) VALUES (?, ?, ?);', [username, email, password], (error, results) => {
            if (error) {
                cconsole.error("Error al signup: ", error);
                reject('Error al signup');
            }
            resolve(results);
        });
    });
}

function getAllUsers(){
    return new Promise((resolve, reject) => {
        db.query(`SELECT username, email, DATE_FORMAT(create_time, \'%d/%m/%Y %H:%i:%s\') create_time, role_id role
                  FROM user
                  ORDER BY create_time DESC;`, (error, results) => {
            if (error) {
                console.error("Error al consultar la db: ", error);
                reject('Error al consultar');
            }
            resolve(results);
        });
    });
}

function updateUserRole(username, roleId){
    return new Promise((resolve, reject) => {
        db.query(`UPDATE user SET role_id = ? WHERE username = ?;`, [roleId, username], (error, results) => {
            if (error) {
                console.error("Error al actualitzar el rol: ", error);
                resolve(false);
            }
            resolve(results.affectedRows > 0);
        });
    });
}

function getRoleFromUsername(username){
    return new Promise((resolve, reject) => {
        db.query('SELECT role_id id FROM user WHERE username = ?', [username], (error, results) => {
            if (error) {
                console.error('Error al consultar la bdd:', error);
                reject('Error al consultar la bdd');
            }
            resolve(results[0].id);
        });
    });
}



module.exports = {
    countUsernamesAndPassword,
    countUsernames,
    addUser,
    getAllUsers,
    updateUserRole,
    getRoleFromUsername
}