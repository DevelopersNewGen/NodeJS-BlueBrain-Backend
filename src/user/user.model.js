import { Schema, model } from "mongoose";

const userSchema = new Schema({
    azureId: {
        type: String,
        required: [true, "Azure ID is required"],
        unique: true, 
        index: true    
    },
    graphToken: {
        type: String
    },
    refreshToken: {
        type: String
    },
    tokenExpiry: {
        type: Date
    },
    profilePicture: {
        type: String,
        default: "https://res.cloudinary.com/dibe6yrzf/image/upload/v1747668225/perfil-de-usuario_cxmmxq.png"
    },
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    username: {
        type: String
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true
    },
    role: {
        type: String,
        required: true,
        default: "STUDENT_ROLE",
        enum: ["ADMIN_ROLE", "STUDENT_ROLE", "TEACHER_ROLE", "TUTOR_ROLE"]
    },
    subjects: [
        {
        type: Schema.Types.ObjectId,
        ref: 'Subject' 
        }
    ],
    rating: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

userSchema.methods.toJSON = function () {
    const { _id, ...usuario } = this.toObject();
    usuario.uid = _id; 
    return usuario;
};

export default model("User", userSchema);