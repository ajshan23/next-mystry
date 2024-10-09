import mongoose, { Schema, Document } from "mongoose";


export interface IMessage extends Document {
    content: string;
    createdAt: Date;
}

const MessageShema: Schema<IMessage> = new Schema({
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now()
    }
})

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verfifyCodeExpiry: Date;
    isAccesptingMessage: boolean;
    isVerified: boolean;
    messages: IMessage[]
}

const UserSchema: Schema<IUser> = new Schema({
    username: {
        type: String,
        required: [true, "USername is required"],
        trim: true,
        unique: true,
    },
    email: {
        type: String,
        required: [true, "email is required"],
        trim: true,
        unique: true,
        match: [/.+\@.+\..+/, 'Please use a valid email address'],
    },
    password: {
        type: String,
        required: true
    },
    verifyCode: {
        type: String,
        required: [true, "Verify code is required"]
    },
    verfifyCodeExpiry: {
        type: Date,
        required: [true, "Verify code expiry  is required"]
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isAccesptingMessage: {
        type: Boolean,
        default: true,
    },
    messages: [
        MessageShema
    ]
})

const UserModel = (mongoose.models.User as mongoose.Model<IUser>) || (mongoose.model<IUser>("User", UserSchema));

export default UserModel;