import Role from '../role/role.model.js';
import User from '../users/user.model.js'

export const existRole = async(role = '')=>{
    const existRole = await Role.findOne({ role });
    if (!existRole) {
        throw new Error(`Rol ${role} does not exist in the database` );

    }
}

export const existEmail = async(email = '')=>{
    const existEmail = await User.findOne({email});
    if (existEmail) {
        throw new Error (`Email ${email} already exists in the database`)
    }
}

export const existUserById = async(id = ``)=>{
    const existUserById = await User.findById(id);
    if (!existUserById) {
        throw new Error(`ID  ${id} does not exist in the database`)
    }
}