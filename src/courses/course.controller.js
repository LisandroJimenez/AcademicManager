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
    const { limite = 10, desde = 0 } = req.query;
    try {
        const courses = await Course.find({ status: true })
            .populate({
                path: "keeper",
                match: { state: true }, 
                select: "name"
            })
            .populate({
                path: "students",
                match: { state: true }, 
                select: "name"
            })
            .skip(Number(desde))
            .limit(Number(limite));
        const filteredCourses = courses.filter(course => course.keeper);
        const total = filteredCourses.length;
        res.status(200).json({
            success: true,
            total,
            courses: filteredCourses.map(course => ({
                ...course.toObject(),
                keeper: course.keeper ? course.keeper.name : "Owner not found",
                students: course.students.map(student => student.name) 
            }))
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Failed to get courses"
        });
    }
};




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

export const assignToCourse = async (req, res) => {
    try {
        const { Id } = req.params; 
        const userId = req.usuario.id;  
        const student = await User.findById(userId);
        if (!student) return res.status(404).json({ 
            success: false, 
            msg: "User not found" 
        });

        if (student.role !== "STUDENT_ROLE") {
            return res.status(403).json({ 
                success: false, 
                msg: "Only students can enroll in courses" 
            });
        }
        const course = await Course.findById(Id);
        if (!course) return res.status(404).json({ 
            success: false, 
            msg: "Course not found" 
        });
        const activeCourses = await Course.find({
            _id: { $in: student.courses },
            status: true
        });
        if (activeCourses.length >= 3) {
            return res.status(400).json({ 
                success: false, 
                msg: "Maximum of 3 active courses allowed" 
            });
        }
        const alreadyEnrolled = course.students.includes(userId);
        if (alreadyEnrolled) {
            return res.status(400).json({ 
                success: false, 
                msg: "Already enrolled in this course" 
            });
        }
        await Promise.all([
            Course.findByIdAndUpdate(Id, { $push: { students: userId } }),
            User.findByIdAndUpdate(userId, { $push: { courses: Id } }),
        ]);
        res.status(200).json({ 
            success: true, 
            msg: "Enrollment successful" 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            msg: "Server error", 
            error 
        });
    }
};

