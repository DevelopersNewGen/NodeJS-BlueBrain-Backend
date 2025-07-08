import {Schema, model} from 'mongoose';

const applicationSchema = new Schema({
    applicantId:{
       type: Schema.Types.ObjectId,
       ref: 'User' 
    },
    subject:{
        type: Schema.Types.ObjectId,
        ref: 'Subject'
    },
    description: {
        type: String,
        required: [true, "Description is required"]
    },
    evidence: {
        type: String,
        required: [true, "Evidence is required"]
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    responseMessage: {
        type: String,
        default: ''
    },
    requestHour: {
        type: Date,
        default: Date.now
    }
}, {
    versionKey: false
});

applicationSchema.methods.toJSON = function () {
    const { _id, ...application } = this.toObject();
    application.aid = _id; 
    return application;
};

export default model('Application', applicationSchema);