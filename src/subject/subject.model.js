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
        enum: ['4to', '5to', '6to'],
        required: [true, "Subject grade is required"]
    },
    description: {
        type: String,
        required: [true, "Subject description is required"],
    },
    status: {
        type: Boolean,
        default: true,
    },
},
{
    timestamps: true,
});

suibjectSchema.methods.toJSON = function () {
    const { _id, __v, ...subject } = this.toObject();
    subject.sid = _id; 
    return subject;
}

export default model('Subject', subjectSchema)
