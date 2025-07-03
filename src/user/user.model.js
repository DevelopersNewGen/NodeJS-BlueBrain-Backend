import { Schema, model } from "mongoose";

const userSchema = Schema({
    azureId: {
        type: String,
        required: [true, "AzureId is required"],
    },
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
    },
    role: {
        type: String,
        required: true,
        default: "STUDENT_ROLE",
        enum: ["ADMIN_ROLE", "STUDENT_ROLE", "TEACHER_ROLE", "TUTOR_ROLE"]
    },
    bio: {
        type: String,
        required: [true, "Bio is required"]
    },
    subjects: [
        {
            type: Schema.Types.ObjectId
        }
    ],
    rating: {
        type: Number,
        required: true,
        default: 0
    }
}, {
    timestamps: true 
});

userSchema.methods.toJSON = function () {
    const { _id, __v, ...user } = this.toObject();
    user.uid = _id; 
    return user;
};

export default model("User", userSchema);