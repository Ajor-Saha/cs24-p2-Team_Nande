import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  deleteUser,
  getUserById,
  getUsers,
  updateAccountDetails,
} from "../controllers/user.controller.js";

const router = express.Router();
router.route("/").get(verifyJWT, getUsers);
router.route("/:userId").get(verifyJWT, getUserById);
router.route("/:userId").delete(verifyJWT, deleteUser);
router.route("/:userId").put(verifyJWT, updateAccountDetails);


export default router;
