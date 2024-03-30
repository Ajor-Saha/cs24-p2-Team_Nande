import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { getCurrentUser, updateProfileDetails } from "../controllers/auth.controller.js";


const router = express.Router();
router.route("/").get(verifyJWT, getCurrentUser);
router.route("/").put(verifyJWT, updateProfileDetails);

export default router;
