import User from '../users/user.model.js';
import { hash , verify } from 'argon2';

export const register = async (req, res) =>{

    try {
        const data = req.body;

        let profilePicture = req.file ? req.filename : null;

        const encryptedPassword = await hash(data.password);
        const user = await User.create({
            name: data.name,
            surname: data.surname,
            username: data.username,
            email: data.email,
            phone: data.phone,
            password: encryptedPassword,
            role: data.role,
            profilePicture
        })
        return res.status(200).json({
            message: "User registered successfully",
            userDetails: {
                user: user.email
            }
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "User registration failed",
            error: error.message
        })
    }

}