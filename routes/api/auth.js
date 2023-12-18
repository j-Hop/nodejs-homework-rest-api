import express from "express";

import authController from "../../controllers/auth-controllers.js";

import { authenticate, isEmptyBody, upload } from "../../middlewares/index.js";

import { validateBody } from "../../decorators/index.js";

import { userLoginSchema, userRegistrationSchema } from "../../models/User.js";


const authRouter = express.Router();

authRouter.post(
  "/register",
  isEmptyBody.isEmptyBody,
  validateBody(userRegistrationSchema),
  authController.register
  );
  
  authRouter.post(
    "/login",
    isEmptyBody.isEmptyBody,
    validateBody(userLoginSchema),
    authController.login
    );
    
    
    authRouter.get("/current", authenticate, authController.getCurrent);
    
    authRouter.post("/logout", authenticate, authController.logout);

    authRouter.patch(
      "/avatars",
      upload.single("avatarURL"),
      authenticate,
      authController.updateAvatar
    )
    
    export default authRouter;