import { Schema, model } from "mongoose";

const CourseSchema = Schema(
    {
        name: {
            type: String,
            required: [true, "Course is required"]
        },
        description: {
            type: String,
            required: [true, "Description is required"]
        },
        status: {
            type: Boolean,
            default: true
        },
        keeper: { 
            type: Schema.Types.ObjectId,
            ref: 'User', 
            required: true 
        },
        students: [{
            type: Schema.Types.ObjectId,
            ref: 'User'  
        }]
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export default model('Course', CourseSchema);
