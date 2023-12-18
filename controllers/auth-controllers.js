import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";
import gravatar from 'gravatar';
import fs from "fs/promises";
import path from "path";
import Jimp from 'jimp';
import { nanoid } from "nanoid";
import { ctrlWrapper } from "../decorators/index.js";
import { HttpError, sendEmail } from "../helpers/index.js";
const { JWT_SECRET, BASE_URL } = process.env;

const avatarsPath = path.resolve("public", "avatars");

const createVerifyEmail = (email, verificationToken) => ({
  to: email,
  subject: "Verify email",
  html: `<a target="_blank" href="${BASE_URL}/users/verify/${verificationToken}">Click verify email</a>`
});


const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const verificationToken = nanoid();

  const newUser = await User.create({ ...req.body, password: hashPassword, avatarURL, verificationToken });

  const verifyEmail = createVerifyEmail(email, verificationToken);

await sendEmail(verifyEmail);

  res.status(201).json({
    user : {
      email: newUser.email,
      subscription: newUser.subscription,
    avatarURL: newUser.avatarURL
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  if (!user.verify) {
    throw HttpError(401, "Email not verify");
}

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }
  const payload = {
    id: user._id,
  };

    const token = jwt.sign(payload, JWT_SECRET, {expiresIn: '23h'})
await User.findByIdAndUpdate(user._id, {token});
  res.json({
    token,
    user : {
      email: user.email,
      subscription: user.subscription,
      avatarURL: user.avatarURL
    },
  });
};

const getCurrent =  async (req, res) => {
  const { email, subscription, avatarURL } = req.user;

    res.json({
      email,
      subscription,
      avatarURL,
    })
}

const logout = async(req, res)=> {
  const {_id} = req.user;
  await User.findByIdAndUpdate(_id, {token: ""});

  res.status(204).json();
}

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  if (!req.file) {
    throw HttpError(400, 'no download file');
  }

  const {path: oldPath, filename} = req.file;

  const pic = await Jimp.read(oldPath);
  await pic
    .autocrop()
    .cover(250, 250, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE)
    .writeAsync(oldPath);

  const newPath = path.join(avatarsPath, filename);
  await fs.rename(oldPath, newPath);
  const avatarURL = path.join('avatars', filename);
  await User.findByIdAndUpdate(_id, { avatarURL });

res.json({
  avatarURL,
});
};


const verify = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
      throw HttpError(404, "User not found");
  }

  await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: ' ' });

  res.json({
      message: "Verification successful"
  })
}

const resendVerify = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
      throw HttpError(401, "Email not found");
  }
  if (user.verify) {
      throw HttpError(400, "Verification has already been passed")
  }
  const verifyEmail = createVerifyEmail(email, user.verificationToken);

  await sendEmail(verifyEmail);

  res.json({
      message: "Verification email sent"
  })
}

export default {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateAvatar: ctrlWrapper(updateAvatar),
  verify: ctrlWrapper(verify),
  resendVerify: ctrlWrapper(resendVerify)
};