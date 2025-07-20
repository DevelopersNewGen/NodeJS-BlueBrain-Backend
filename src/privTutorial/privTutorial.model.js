import { Schema, model } from "mongoose";

const privTutorial = new Schema({
    tutor: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    student: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    subject: {
        type: Schema.Types.ObjectId,
        ref: 'Subject',
        required: true
    },
    topic: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    scheduledDate: {
        type: Date,
        required: true
    },
    scheduledEndTime: {
        type: Date,
        required: true
    },
    actualDate: {
        type: Date
    },
    actualTime: {
        type: String
    },
    duration: {
        type: Number,
        default: 60
    },
    meetingLink: {
        type: String
    },
    status: {
        type: String,
        enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED', 'CANCELLED'],
        default: 'PENDING'
    },
    acceptedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    acceptedAt: {
        type: Date
    },
    relatedTutorial: {
        type: Schema.Types.ObjectId,
        ref: 'Tutorial'
    }
}, {
    timestamps: true
});

privTutorial.methods.toJSON = function () {
    const { _id, __v, ...privTutorial } = this.toObject();
    privTutorial.ptid = _id; 
    return privTutorial;
}

export default model('PrivTutorial', privTutorial);
