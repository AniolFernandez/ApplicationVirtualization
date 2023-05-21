const roleRepository = require('../repository/role');

module.exports = {
    //Obtenció llistat de rols
    getRoles: async function () {
        return await roleRepository.getAllRoles();;
    },

    //Afegir rol
    afegirRol: async function (nom) {
        const id = await roleRepository.getNewId();
        const ok = await roleRepository.addRole(id, nom);
        return ok ? id : null;
    },

    //Eliminar rol
    deleteRoleById: async function (id) {
        return await roleRepository.deleteRoleById(id);
    },

    //Actualitzar rol
    editarRol: async function (role) {
        return await roleRepository.updateRole(role);
    },
}