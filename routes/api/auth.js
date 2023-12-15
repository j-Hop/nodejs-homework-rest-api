import express from "express";

import authController from "../../controllers/auth-controllers.js";

import { authenticate, isEmptyBody } from "../../middlewares/index.js";

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
    
    export default authRouter;