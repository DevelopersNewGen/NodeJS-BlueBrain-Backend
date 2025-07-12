import {Schema, model} from 'mongoose';

const privTutorialSchema = new Schema({
    studentId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tutorId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    subject: {
        type: Schema.Types.ObjectId,
        ref: 'Subject',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    meetingLink: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['PENDING', 'COMPLETED', 'CANCELLED'],
        default: 'PENDING'
    },
    feedBack: [
        {
            comment: {
                type: String,
                required: true,
                trim: true,
                minlength: [10, "Comment must be at least 10 characters long"],
                maxlength: [500, "Comment must be at most 500 characters long"]
            },
            rating: {
                type: Number,
                required: true,
                min: 1,
                max: 5
            },
        }
    ],
    resources: {
        type: String,
        required: false,
        trim: true
    },
}, {
    timestamps: true,
});

privTutorialSchema.methods.toJSON = function () {
    const { _id, __v, ...privTutorial } = this.toObject();
    privTutorial.ptid = _id; 
    return privTutorial;
}

export default model('PrivTutorial', privTutorialSchema);
