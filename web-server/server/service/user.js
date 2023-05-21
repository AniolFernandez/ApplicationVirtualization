const userRepository = require('../repository/user')
const jwt = require('../security/jwt')
const adminUser = 'admin';
const adminPass = process.env.ADMIN_PW || 'admin';
const crypto = require('crypto');
const pepper = "appvirt*_;)";

function _computeHash(string, salt) {
    return crypto.createHash('sha512').update(salt + string + pepper).digest('hex');
}

async function _goodLoginCredentials(username, password) {
    const results = await userRepository.countUsernamesAndPassword(username,_computeHash(password, username));
    return results[0].count > 0;
}

module.exports = {
    //Login
    login: async function (username, password, bypassPasswordCheck = false) {
        if (bypassPasswordCheck || (username == adminUser && password == adminPass) || await _goodLoginCredentials(username, password))
            return jwt.getAccessToken({ user: username }, { expiresIn: '120d' })
        else
            throw new Error('Login failed');
    },

    //Existeix usuari 
    existeixUsuari: async function (username) {
        if (username == adminUser) return true; //default admin user
        const results = await userRepository.countUsernames(username);
        return results[0].count > 0;
    },

    //Registrar usuari
    registrarUsuari: async function (username, password, email) {
        const results = await userRepository.addUser(username, email, _computeHash(password, username));
        return results.affectedRows == 1;
    },

    //Obtenció llistat usuaris
    getUsers: async function () {
        const results = await userRepository.getAllUsers();

        const users = results.map(result => ({
            username: result.username,
            email: result.email,
            role: result.role,
            createTime: result.create_time
        }));
        return users;
    },

    //Update rol
    updateUserRole: async function (username, roleid) {
        return await userRepository.updateUserRole(username, roleid);
    },

    //Obté el rol d'un usuari
    getUserRole: async function (username) {
        if (username=='admin') return null;
        return await userRepository.getRoleFromUsername(username);
    },
}