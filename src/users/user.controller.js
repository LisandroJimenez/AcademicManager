import { response } from "express";
import User from "./user.model.js";

export const getUsers = async (req = request, res = response) => {
  try {
    const { limite = 10, desde = 0 } = req.query;
    const query = { state: true };

    const [total, users] = await Promise.all([
      User.countDocuments(query),
      User.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
        .populate({
          path: 'courses',  
          match: { status: true }, 
          select: 'name description',  
        })
        .populate({
          path: 'createdCourses',  
          match: { status: true }, 
          select: 'name description',  
        })
    ]);

    res.status(200).json({
      success: true,
      total,
      users
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Error getting users",
      error
    });
  }
};

export const updateUser = async (req, res ) => {
    try {
      const { id } = req.params;
      const { _id, password, email, ...data } = req.body;

      if(password ){
          data.password = await hash(password);
      }

      const user = await User.findByIdAndUpdate(id, data, { new: true });
      res.status(200).json({
          success: true,
          msg: 'Updated User',
          user
      })
    } catch (error) {
        res.status(500).json({
            success: false, 
            msg: 'Error when updating user'
        })
    }
}

export const deleteUser = async (req, res) => {
  try {
      const { id } = req.params;
      const authenticatedUser = req.usuario;
      console.log("Authenticated user:", req.usuario);
      if (authenticatedUser.id !== id) {
          return res.status(403).json({
              success: false,
              msg: "You can only deactivate your own account"
          });
      }

      const user = await User.findByIdAndUpdate(id, { state: false }, { new: true });
      if (!user) {
          return res.status(404).json({
              success: false,
              msg: "User not found"
          });
      }
      res.status(200).json({
          success: true,
          msg: 'User deactivated',
          user,
          authenticatedUser
      });
  } catch (error) {
      res.status(500).json({
          success: false,
          msg: 'Error deactivating user',
          error
      });
  }
};
