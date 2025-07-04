import { Schema, model } from "mongoose";

const subjectSchema = new Schema({
    teachers: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User' 
        }
    ],
    name: {
        type: String,
        required: [true, "Subject name is required"],
        unique: true,
    },
    code: {
        type: String,
        required: [true, "Subject code is required"],
        unique: true,
    },
    grade: {
        type: String,
    },
    description: {
        type: String,
        required: [true, "Subject description is required"],
    },
    status: {
        type: Boolean,
        default: true,
    },
})

export default model('Subject', subjectSchema)
