import express from "express";
import {
  changeCurrentPassword,
  confirmOTP,
  forgetPassword,
  loginEmploy,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  verifyOTP,
  workerLogout,
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { verifyWorkerJWT } from "../middleware/worker.middleware.js";

const router = express.Router();
router.route("/create").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/verify").post(verifyOTP);
router.route("/reset-password").post(resetPassword);
router.route("/reset-password/initiate").post(forgetPassword);
router.route("/reset-password/confirm").post(confirmOTP);
router.route("/workerlogin").post(loginEmploy);
router.route("/workerLogout/").post(verifyWorkerJWT, workerLogout);

export default router;
