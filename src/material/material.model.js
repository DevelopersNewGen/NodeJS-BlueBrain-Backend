import { Schema, model } from "mongoose";

const materialSchema = new Schema({
    uploaderId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Uploader is required"]
    },
    title: {
        type: String,
        required: [true, "Title is required"]
    },
    description: {
        type: String,
        required: [true, "Description is required"]
    },
    subject: {
        type: Schema.Types.ObjectId,
        ref: 'Subject',
        required: [true, "Subject is required"]
    },
    grade: {
        type: String,
        enum: ['4to', '5to', '6to'],
        required: [true, "Grade is required"]
    },
    type: {
        type: String,
        enum: ['pdf', 'video'],
        required: [true, "Type is required"]
    },
    fileUrl: {
        type: String,
        required: [true, "File URL is required"]
    }
}, {
    timestamps: true
});

materialSchema.methods.toJSON = function () {
    const { _id, __v, ...material } = this.toObject();
    material.mid = _id;
    return material;
};

export default model('Material', materialSchema);