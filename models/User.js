import Joi from "joi";
import { Schema, model } from "mongoose";
import { handleSaveError, preUpdate } from "./hooks.js";

const status = ["starter", "pro", "business"];
const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = new Schema( 
{
    password: {
      type: String,
      required: [true, "Set password for user"],
      minLength: 6,
    },
    email: {
      type: String,
      match: emailRegexp,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: status,
      default: "starter",
    },
    token: String,
    avatarURL: String,
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, 'Verify token is required'],
    },
},
  { versionKey: false, timestamps: true }
)

userSchema.post("save", handleSaveError);

userSchema.pre("findOneAndUpdate", preUpdate);

userSchema.post("findOneAndUpdate", handleSaveError);

export const userRegistrationSchema = Joi.object({
    password: Joi.string().min(6).required().messages({
        "any.required": `missing required password field`}),
    email: Joi.string().pattern(emailRegexp).required().messages({
        "any.required": `missing required email field`}),
    subscription: Joi.string().valid(...status),
    token: Joi.string(),
});

export const userLoginSchema = Joi.object({
    password: Joi.string().min(6).required().messages({
        "any.required": `missing required password field`}),
    email: Joi.string().pattern(emailRegexp).required().messages({
        "any.required": `missing required email field`}),
    token: Joi.string(),
});

export const userEmailSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required().messages({
    "any.required": `missing required field email`}),
})

const User = model("user", userSchema);

export default User ;