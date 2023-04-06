const db = require('../db');
const jwt = require('../security/jwt')
const adminUser = process.env.ADMIN_USER || 'admin';
const adminPass = process.env.ADMIN_PW || 'admin';

module.exports = {
    //Login
    login: function (username, password, bypassPasswordCheck=false) {
        if (bypassPasswordCheck || (username == adminUser && password == adminPass))
            return jwt.getAccessToken({ user: username }, { expiresIn: '1d' })
        else
            throw new Error('Login failed');
    },

    //Existeix usuari 
    existeixUsuari: function (username) {
        if (username == adminUser) return true; //default admin user
        let res = false;
        db.query('SELECT count(*) as count FROM user WHERE username = ?', [username], (error, results, fields) => {
            if (error) {
                console.error('Error al consultar la bdd:', error);
                throw new Error('Error al consultar la bdd');
            }
            res = results[0].count > 0;
        });
        return res;
    },

    //Registrar usuari
    registrarUsuari: function (username, password, email) {
        let res=true;
        db.query('INSERT INTO user (username, email, password) VALUES (?, ?, ?);', [username, email, password], (error, results, fields) => {
            if (error) {
                console.error("Error al signup: ", error);
                res=false;
            }
            res= results.affectedRows == 1;
        });
        return res;
    }
}