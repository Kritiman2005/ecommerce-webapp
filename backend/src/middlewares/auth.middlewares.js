import jwt from "jsonwebtoken";
import {User} from "../models/user.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";

export const verifyJWT = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return next(new ApiError(401, "Unauthorized request"));
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id);

        if (!user) {
            return next(new ApiError(401, "Invalid access token"));
        }

        req.user = user;
        next();
    } catch (error) {
        return next(new ApiError(401, "Invalid access token"));
    }
};


export const validateUserRole = (roles = []) => {
    return (req, res, next) => {
        if (!roles.includes(req.user?.role)) {
            return next(new ApiError(403, "You are not authorised to perform this action"));
        }
        next();
    };
};


