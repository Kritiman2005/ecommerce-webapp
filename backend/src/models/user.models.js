import mongoose , {Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { UserRolesEnum , AvailableUsersRole } from "../utils/constants";


const userSchema  = new Schema({
    username : {
        type: String,
        required: true,
        index: true,
        unique: true,
    },
    email : {
        type: String,
        required: true,
        index: true,
        unique: true,
    },
    role: {
        type: String,
        enum: AvailableUsersRole,
        default: UserRolesEnum.USER,
        required: true,
    },
    password : {
        type: String,
    },
    refreshToken: {
        type: String,
    },
    refreshTokenExpiry: {
        type: Date,
    },
    forgotpasswordToken: {
        type : String,
    },
    forgotpasswordTokenExpiry: {
        type: Date,
    },
},
{
    timestamps : true
},
);

userSchema.pre("save", async function (next){
    if(!this.isModified("password")){
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {
           _id : this._id,
           username: this.username,
           email: this.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: process.env.ACCESS_TOKEN_EXPIRY},
    );
};

userSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
        {
           _id : this._id,
           username: this.username,
           email: this.email
        },
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn: process.env.REFRESH_TOKEN_EXPIRY},
    );
}

userSchema.methods.generateTemporaryToken = function() {
    const unHashedToken = crypto.randomBytes(20).toString("hex")

    const hashedToken = crypto
        .createHash("sha256")
        .update(unHashedToken)
        .digest("hex")

    const tokenExpiry = Date.now() + (20*60*1000) //20 mins
    
    return {unHashedToken,hashedToken,tokenExpiry};
}


export const User = mongoose.model("User",userSchema);

