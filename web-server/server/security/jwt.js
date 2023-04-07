const jwt = require('jsonwebtoken');
const secret = 'q@4iMlcS!AnMC74ZfxB0GNh623VN!Qo*Jf$6wuKBFZ*f0doBJ1';

//Generador de token
const getAccessToken = (payload, options) => {
    return jwt.sign(payload, secret, { 
        ...(options && options), 
        algorithm: 'HS256', 
    });
};

//Processar les dades de cada petició per validar el token
const processToken = async (req, res, next) => {
    let access_token;
    try{
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            access_token = req.headers.authorization.split(' ')[1];
            req.access_token = access_token;
            const decoded = jwt.verify(access_token, secret);
            if (decoded) {
                req.authUser = decoded.user; //Assigna l'usuari a la request si aquesta està validada
                if(decoded.user=='admin') req.isAdmin=true; //Validació d'admin
            } 
        }
    }
    catch(err){
        console.log(err);
    }
    next();
};

module.exports = { getAccessToken, processToken };