import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";



export async function POST(request: Request) {
    await dbConnect();
    try {
        const { username, email, password } = await request.json();
        const existingUserVerifiedByUsername = await UserModel.findOne({ username, isVerified: true });
        if (existingUserVerifiedByUsername) {
            return Response.json({ message: 'Username already taken', success: false }, { status: 400 })
        }
        const existingUserByEmail = await UserModel.findOne({ email });
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json({ message: 'User already exist with this email', success: false }, { status: 400 })
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                const expiryDate = new Date();
                expiryDate.setHours(expiryDate.getHours() + 1);

                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verfifyCodeExpiry = new Date(Date.now() + 3600000);
                await existingUserByEmail.save();
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verfifyCodeExpiry: expiryDate,
                isAccesptingMessage: true,
                messages: []
            })

            await newUser.save();
        }
        //send email for veriification

        const emailResponse = await sendVerificationEmail({ email, username, verifyCode });

        console.log("email response", emailResponse);
        if (!emailResponse.success) {
            return Response.json({ message: emailResponse.message, success: false }, { status: 500 })
        }

        return Response.json({ message: 'User registered successfully, Please verify your email', success: true }, { status: 201 })

    } catch (error) {
        console.error('Error registering user:', error)
        return Response.json({ message: 'Error registering user', success: false }, { status: 500 })
    }
}