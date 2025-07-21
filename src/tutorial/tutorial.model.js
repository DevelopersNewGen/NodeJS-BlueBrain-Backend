import { Schema, model } from "mongoose";

const tutorial = new Schema({
    host: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "host is required"]
    },
    subject: {
        type: Schema.Types.ObjectId,
        ref: 'Subject',
        required: [true, "Subject is required"]
    },
    access: {
        type: String,
        enum: ['PUBLIC', 'PRIVATE'],
        default: 'PUBLIC'
    },
    topic: {
        type: String,
        required: [true, "Topic is required"],
    },
    description: {
        type: String,
        required: [true, "Description is required"],
    },
    startTime: {
        type: Date,
        required: [true, "Start time is required"]
    },
    endTime: {
        type: Date,
        required: [true, "End time is required"]
    },
    status: {
        type: String,
        enum: ['EXPIRED', 'INCOURSE', 'CANCELLED', 'COMPLETED', 'FULL'],
        default: 'INCOURSE'
    },
}, {
    timestamps: true
});

tutorial.methods.toJSON = function () {
    const { _id, __v, ...tutorial } = this.toObject();
    tutorial.tid = _id; 
    return tutorial;
};

export default model("Tutorial", tutorial);


