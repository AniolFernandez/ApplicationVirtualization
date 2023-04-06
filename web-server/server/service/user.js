const db = require('../db');
const jwt = require('../security/jwt')
const adminUser = 'admin';
const adminPass = process.env.ADMIN_PW || 'admin';

async function _goodLoginCredentials(username, password){
    let res = false;
    await db.query('SELECT count(*) as count FROM user WHERE username = ? and password = ?', [username, password], (error, results) => {
        if (error) {
            console.error('Error al consultar la bdd:', error);
            throw new Error('Error al consultar la bdd');
        }
        res = results[0].count > 0;
    });
    return res;
}

module.exports = {
    //Login
    login: function (username, password, bypassPasswordCheck=false) {
        if (bypassPasswordCheck || (username == adminUser && password == adminPass) || _goodLoginCredentials(username, password))
            return jwt.getAccessToken({ user: username }, { expiresIn: '1d' })
        else
            throw new Error('Login failed');
    },

    //Existeix usuari 
    existeixUsuari: async function (username) {
        if (username == adminUser) return true; //default admin user
        let res = false;
        await db.query('SELECT count(*) as count FROM user WHERE username = ?', [username], (error, results) => {
            if (error) {
                console.error('Error al consultar la bdd:', error);
                throw new Error('Error al consultar la bdd');
            }
            res = results[0].count > 0;
        });
        return res;
    },

    //Registrar usuari
    registrarUsuari: async function (username, password, email) {
        let res=true;
        await db.query('INSERT INTO user (username, email, password) VALUES (?, ?, ?);', [username, email, password], (error, results) => {
            if (error) {
                console.error("Error al signup: ", error);
                res=false;
            }
            res= results.affectedRows == 1;
        });
        return res;
    }
}