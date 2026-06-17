import jwt from "jsonwebtoken";
import User from "../models/user.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";

export const verifyJWT = async(req,res,next) => {
    
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    

    if(!token){
        throw new ApiError(401, "Unauthorized request");
    }


    try {
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
        
        const user = User.findById(decodedToken?._id);
        
        if(!user){
            throw new ApiError(401, "Invalid access token");
        }

        req.user = user;
        next();

    } catch (error) {
        throw new ApiError(401, "Invalid access token");
    }
};


