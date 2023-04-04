const db = require('../db');
const jwt = require('../security/jwt')

module.exports = {
    //Login
    login: function (username, password) {
        if (username == "root" && password == "root")
            return jwt.getAccessToken({ user: username }, { expiresIn: '1d' })
        else
            throw new Error('Login failed');
    }
}