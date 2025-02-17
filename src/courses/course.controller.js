import User from "../users/user.model.js";
import Course from "./course.model.js";

export const saveCourse = async (req, res) => {
    try {
        const data = req.body;
        const user = await User.findOne({ email: data.email });
        if (!user) {
            return res.status(404).json({
                success: false,
                msg: 'Owner not found'
            });
        }
        if (user.role !== 'TEACHER_ROLE') {
            return res.status(403).json({
                success: false,
                msg: 'User is not authorized to create courses'
            });
        }
        const course = new Course({
            ...data,
            keeper: user._id  
        });
        await course.save();
        user.createdCourses.push(course._id);
        await user.save();

        res.status(200).json({
            success: true,
            course
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: 'Error saving the course',
            error: error.message
        });
    }
};



export const getCourses = async (req, res) => {
    const {limite = 10, desde =0} = req.query;
    const query = {status : true}
    try {
        const courses = await Course.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
        const courseWithOwnerNames = await Promise.all(courses.map(async (course) => {
            const owner = await User.findById(course.keeper)
            return{
                ...course.toObject(),
                keeper: owner ? owner.name: "Owner not found"
            }
        }))

        const total = await Course.countDocuments(query)
        res.status(200).json({
            success: true, 
            total,
            courses: courseWithOwnerNames
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Failed to get courses'
        })
    }
}

export const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params
        await Course.findByIdAndUpdate(id, {status: false})
        res.status(200).json({
            success: true,
            message: 'Course successfully removed'
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting Course',
            error
        })
    }
}

export const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, _id, ...data } = req.body;
        if (email) {
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({
                    success: false,
                    msg: 'User with this email not found'
                });
            }
            data.keeper = user._id;
        }
        const course = await Course.findByIdAndUpdate(id, data, { new: true });
        if (!course) {
            return res.status(404).json({
                success: false,
                msg: 'Course not found'
            });
        }
        res.status(200).json({
            success: true,
            msg: 'Successfully updated course',
            course
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Failed to update the course',
            error: error.message
        });
    }
};