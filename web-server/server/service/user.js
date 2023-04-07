const db = require('../db');
const jwt = require('../security/jwt')
const adminUser = 'admin';
const adminPass = process.env.ADMIN_PW || 'admin';
const crypto = require('crypto');
const pepper = "appvirt*_;)";

function _computeHash(string, salt) {
    return crypto.createHash('sha512').update(salt + string + pepper).digest('hex');
}

async function _goodLoginCredentials(username, password) {
    const results = await new Promise((resolve, reject) => {
        db.query('SELECT count(*) as count FROM user WHERE username = ? and password = ?', [username, _computeHash(password, username)], (error, results) => {
            if (error) {
                console.error('Error al consultar la bdd:', error);
                reject('Error al consultar la bdd');
            }
            resolve(results);
        });
    });
    return results[0].count > 0;
}

module.exports = {
    //Login
    login: async function (username, password, bypassPasswordCheck = false) {
        if (bypassPasswordCheck || (username == adminUser && password == adminPass) || await _goodLoginCredentials(username, password))
            return jwt.getAccessToken({ user: username }, { expiresIn: '1d' })
        else
            throw new Error('Login failed');
    },

    //Existeix usuari 
    existeixUsuari: async function (username) {
        if (username == adminUser) return true; //default admin user
        const results = await new Promise((resolve, reject) => {
            db.query('SELECT count(*) as count FROM user WHERE username = ?', [username], (error, results) => {
                if (error) {
                    console.error('Error al consultar la bdd:', error);
                    reject('Error al consultar la bdd');
                }
                resolve(results);
            });
        });
        return results[0].count > 0;
    },

    //Registrar usuari
    registrarUsuari: async function (username, password, email) {
        const results = await new Promise((resolve, reject) => {
            db.query('INSERT INTO user (username, email, password) VALUES (?, ?, ?);', [username, email, _computeHash(password, username)], (error, results) => {
                if (error) {
                    cconsole.error("Error al signup: ", error);
                    reject('Error al signup');
                }
                resolve(results);
            });
        });
        return results.affectedRows == 1;
    },

    //Obtenció llistat usuaris
    getUsers: async function () {
        const results = await new Promise((resolve, reject) => {
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

        const users = results.map(result => ({
            username: result.username,
            email: result.email,
            role: result.role,
            createTime: result.create_time
          }));
        return users;
    }
}