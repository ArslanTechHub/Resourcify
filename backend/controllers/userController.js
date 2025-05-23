import { catchAsyncError } from '../middlewares/catchAsyncError.js'
import { Booking } from '../models/Booking.js'
import { LendItemRequest } from '../models/LendItemRequest.js'
import { LendLabResource } from '../models/LendLabResourceRequest.js'
import { User } from '../models/User.js'
import ErrorHandler from '../utils/errorHandler.js'
import { sendToken } from '../utils/sendToken.js'
import { lendLibraryItem } from './libraryItemsController.js'
import crypto from 'crypto'
// import sendEmail from '../utils/sendEmail.js'

export const login = catchAsyncError(async (req, res, next) => {
    const { identifier, password } = req.body // `identifier` can be rollNo or email

    if (!identifier || !password) {
        return next(new ErrorHandler('Please Enter All Fields', 400))
    }

    let user

    // Determine if the identifier is a roll number based on its pattern
    const traditionalRollNoPattern = /^[a-z]{2}\d{2}-[a-z]{3}-\d{3}$/i // Matches `fa22-bse-073` format
    const numericIdPattern = /^\d+$/i // Matches numeric student IDs like "12345"

    if (traditionalRollNoPattern.test(identifier) || numericIdPattern.test(identifier)) {
        // If identifier matches any roll number format
        user = await User.findOne({ rollNo: identifier }).select('+password')
    } else {
        // Otherwise, treat identifier as an email
        user = await User.findOne({ email: identifier }).select('+password')
    }

    if (!user) {
        return next(new ErrorHandler('Incorrect Identifier or Password', 409))
    }

    // Restrict login for unverified users
    if (!user.isVerified) {
        return next(new ErrorHandler('Please verify your email before logging in.', 401))
    }

    const isMatch = await user.comparePassword(password)

    if (!isMatch) {
        return next(new ErrorHandler('Incorrect Identifier or Password', 400))
    }

    sendToken(res, user, `Welcome Back ${user.name}`, 200)
})

export const register = catchAsyncError(async (req, res, next) => {
    const { name, rollNo, password, email, role, gender } = req.body
    if (!name || !password || !email || !role || !gender) {
        return next(new ErrorHandler('Please Enter all fields', 401))
    }

    let user

    if (role.value === 'student') {
        // Validate rollNo is present for students
        if (!rollNo) {
            return next(new ErrorHandler('Roll Number is required for students', 401))
        }
        
        user = await User.findOne({ rollNo: rollNo })

        if (user) {
            return next(new ErrorHandler('User Exists Already', 401))
        }

        // Generate email verification token
        const emailVerificationToken = crypto.randomBytes(32).toString('hex')

        user = await User.create({
            name: name,
            rollNo: rollNo,
            password: password,
            email: email,
            role: role.value,
            gender: gender.value,
            isVerified: false,
            emailVerificationToken,
        })

        // Generate the verification link using the frontend URL from env
        const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${emailVerificationToken}`
        const sendEmail = (await import('../utils/sendEmail.js')).default;
        await sendEmail(
            user.email,
            'Verify your email',
            `Please click the following link to verify your email:<br><a href="${verifyUrl}">${verifyUrl}</a>`
        )

    } else {
        user = await User.findOne({ email: email })

        if (user) {
            return next(new ErrorHandler('User Exists Already', 401))
        }

        // Generate email verification token
        const emailVerificationToken = crypto.randomBytes(32).toString('hex')

        user = await User.create({
            name: name,
            password: password,
            email: email,
            role: role.value,
            gender: gender.value,
            isVerified: false,
            emailVerificationToken,
        })

        // Generate the verification link using the frontend URL from env
        const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${emailVerificationToken}`
        const sendEmail = (await import('../utils/sendEmail.js')).default;
        await sendEmail(
            user.email,
            'Verify your email',
            `Please click the following link to verify your email:<br><a href="${verifyUrl}">${verifyUrl}</a>`
        )
    }

    // Only one response for both cases
    return res.status(200).json({
        success: true,
        message: 'Account Created Successfully! Please check your email to verify your account.',
    })
})

// Email Verification Endpoint
export const verifyEmail = catchAsyncError(async (req, res, next) => {
    const { token } = req.query
    console.log("Verification token received:", token);

    if (!token) {
        console.log("No token provided");
        return next(new ErrorHandler('Verification token is missing', 400))
    }

    const user = await User.findOne({ emailVerificationToken: token })
    console.log("User found for token:", user);

    if (!user) {
        console.log("No user found for token:", token);
        return next(new ErrorHandler('Invalid or expired verification token', 400))
    }

    user.isVerified = true
    user.emailVerificationToken = undefined
    await user.save()

    console.log("User after verification:", user);

    res.status(200).json({
        success: true,
        message: 'Email verified successfully! You can now log in.',
    })
})

export const getMyProfile = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user._id)

    res.status(200).json({
        sucess: true,
        user,
    })
})

export const logout = catchAsyncError(async (req, res, next) => {
    res.status(200)
        .cookie('token', null, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,

            expires: new Date(Date.now()),
        })
        .json({
            sucess: true,
            message: 'User Logged Out Sucessfully',
        })
})

export const getMyRequests = catchAsyncError(async (req, res, next) => {
    const libraryItems = await LendItemRequest.find({ borrower: req.user._id })
        .populate('item')
        .populate('borrower')
    
    console.log("User ID for requests:", req.user._id);
        
    const labResources = await LendLabResource.find({ borrower: req.user._id })
        .populate('item')
        .populate('borrower');

    console.log("Lab resources found:", labResources.length);
        

    const roomBookings = await Booking.find({
        user: req.user._id,
    }).populate('roomId')

    res.status(200).json({
        success: true,
        libraryItems,
        labResources,
        roomBookings,
    })
})