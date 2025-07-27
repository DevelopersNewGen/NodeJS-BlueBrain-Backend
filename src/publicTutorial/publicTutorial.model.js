import { Schema, model } from "mongoose";

const publicTutorial = new Schema({
    tutor: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    students: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
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
        enum: ['PENDING', 'COMPLETED', 'CANCELLED'],
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

publicTutorial.methods.toJSON = function () {
    const { _id, __v, ...publicTutorial } = this.toObject();
    publicTutorial.ptid = _id; 
    return publicTutorial;
}

export default model('PublicTutorial', publicTutorial);
