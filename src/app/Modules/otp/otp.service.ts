import crypto from "crypto"
import { User } from "../user/user.model"
import AppError from "../../errorHelpers/AppError"
import { redisClient } from "../../config/redis.config"
import { sendEmail } from "../../utils/sendEmail"


const OTP_EXPIRATION = 2 * 60 // 2 MIN TIMER

const generateOtp = (length = 6) => {
    const otp = crypto.randomInt(10 ** (length-1), 10 ** length).toString()

    return otp
}


const sendOtp = async(email: string, name: string) => {

    const user = await User.findOne({email})

    if (!user) {
        throw new AppError(404, "User not found")
    }

    if (user.isVerified){
        throw new AppError(401, "You are already verified")
    }

    const otp = generateOtp()

    const redisKey = `otp:${email}`

    await redisClient.set(redisKey, otp, {
        expiration: {
            type: "EX",
            value: OTP_EXPIRATION
        }
    })

    await sendEmail({
        to: email,
        subject: "Your OTP Code",
        templateName: "otp",
        templateData: {
            name: name,
            otp: otp,
        }
    })

}

export const OTPService = {
    sendOtp
}