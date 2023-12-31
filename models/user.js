import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    login: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    passHash: {
        type: String,
        required: true,
    },
    avatarUrl: String,
    role: { type: String, required: true, default: "user" }
}, {
    timestamps: true,
})

UserSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.passHash;
        return ret;
    }
});

export default mongoose.model('User', UserSchema)