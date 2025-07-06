import {Schema, model} from "mongoose";

const reportSchema = new Schema({
    reportBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Report must have a reporter"]
    },
    reportTo: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Report must have a reported user"]
    },
    reason: {
        type: String,
        required: [true, "Report must have a reason"],
        trim: true,
    },
    relatedSubject: {
        type: Schema.Types.ObjectId,
        ref: 'Subject',
        required: [true, "Report must be related to a subject"]
    },
    details: {
        type: String,
        required: [true, "Report must have details"],
        trim: true,
        minlength: [10, "Details must be at least 10 characters long"],
        maxlength: [500, "Details must be at most 500 characters long"]
    },
    status: {
        type: String,
        enum: ['PENDING', 'RESOLVED', 'REJECTED'],
        default: 'PENDING',
    },
}, {
    timestamps: true,
});

reportSchema.methods.toJSON = function () {
    const { _id, __v, ...report } = this.toObject();
    report.rid = _id; 
    return report;
}

export default model("Report", reportSchema);