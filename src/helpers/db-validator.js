import Role from '../role/role.model.js';
import User from '../users/user.model.js'

export const validRole = async(role = '')=>{
    const existRole = await Role.findOne({ role });
    if (!existRole) {
        throw new Error(`Rol ${role} does not exist in the database` );

    }
}

export const existentEmail = async(email = '')=>{
    const existEmail = await User.findOne({email});
    if (existEmail) {
        throw new Error (`Email ${email} already exists in the database`)
    }
}

export const existUserById = async(id = ``)=>{
    const existUser = await User.findById(id);
    if (!existUser) {
        throw new Error(`ID  ${id} does not exist in the database`)
    }
}