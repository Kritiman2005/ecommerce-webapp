import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { sendEmail, forgotPasswordMailgenContent } from "../utils/mail.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const generateAccessandRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(
            500,
            "Something went wrong in generating Access and Refresh Tokens"
        );
    }
};

const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    const existeduser = await User.findOne({
        $or: [{ username }, { email }],
    });

    if (existeduser) {
        throw new ApiError(409, "User with username or email already exists");
    }

    const user = await User.create({
        username,
        email,
        password,
    });

    const createduser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if (!createduser) {
        throw new ApiError(
            500,
            "Something went wrong while registering the user"
        );
    }

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                { user: createduser },
                "User registered successfully"
            )
        );
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(400, "User does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(400, "Invalid credentials");
    }

    const { accessToken, refreshToken } =
        await generateAccessandRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken,
                },
                "User is logged in successfully"
            )
        );
};

const logoutUser = async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: "",
            },
        },
        {
            new: true,
        }
    );

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
};

const refreshAccessToken = async (req, res) => {
    const incomingrefreshToken =
        req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingrefreshToken) {
        throw new ApiError(401, "Unauthorized Access");
    }

    try {
        const decodedToken = jwt.verify(
            incomingrefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(decodedToken?._id);

        if (!user) {
            throw new ApiError(401, "Invalid refresh Token");
        }

        if (incomingrefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired");
        }

        const { accessToken, refreshToken: newRefreshToken } =
            await generateAccessandRefreshToken(user._id);

        const options = {
            httpOnly: true,
            secure: true,
        };

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    {
                        accessToken,
                        refreshToken: newRefreshToken,
                    },
                    "Access Token refreshed"
                )
            );
    } catch (error) {
        throw new ApiError(401, "Invalid refresh Token");
    }
};

const changeCurrentPassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user?._id);

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password");
    }

    user.password = newPassword;

    await user.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password changed successfully"));
};

const forgotPasswordRequest = async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404, "User with this email does not exist");
    }

    
    const { unHashedToken, hashedToken, tokenExpiry } =
        user.generateTemporaryToken();

    
    user.forgotpasswordToken = hashedToken;
    user.forgotpasswordTokenExpiry = tokenExpiry;
    await user.save({ validateBeforeSave: false });

    
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${unHashedToken}`;

    
    await sendEmail({
        email: user.email,
        subject: "Password Reset Request",
        mailgenContent: forgotPasswordMailgenContent(user.username, resetUrl),
    });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Password reset email sent successfully. Check your inbox."
            )
        );
};

const resetForgotPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
        throw new ApiError(400, "New password is required");
    }

    
    const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    
    const user = await User.findOne({
        forgotpasswordToken: hashedToken,
        forgotpasswordTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
        throw new ApiError(489, "Token is invalid or has expired");
    }

    user.password = newPassword;
    user.forgotpasswordToken = undefined;
    user.forgotpasswordTokenExpiry = undefined;

    await user.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password reset successfully"));
};

const assignRole = async(req,res) => {
    const {userId, role} =  req.body;

    const user = await User.findByIdAndUpdate(
        userId,
        {role},
        {new: true},
    );
    
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, { user }, "Role updated successfully"));
};

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    forgotPasswordRequest,
    resetForgotPassword,
    assignRole,
};
