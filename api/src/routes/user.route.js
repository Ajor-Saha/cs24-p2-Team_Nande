import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  addNewUser,
  deleteUser,
  getLandfillManagerList,
  getManagersList,
  getUnassignedUser,
  getUserById,
  getUsers,
  updateAccountDetails,
  updateUserRoles,
} from "../controllers/user.controller.js";

const router = express.Router();
router.route("/").get(verifyJWT, getUsers);
router.route("/:userId").get(verifyJWT, getUserById);
router.route("/:userId").delete(verifyJWT, deleteUser);
router.route("/:userId").put(verifyJWT, updateAccountDetails);
router.route("/").post(verifyJWT, addNewUser);
router.route("/:userId/roles").put(verifyJWT, updateUserRoles);
router.route("/user/sts").get(verifyJWT, getManagersList);
router.route("/user/landfill").get(verifyJWT, getLandfillManagerList);
router.route("/user/unassigned").get(verifyJWT, getUnassignedUser);

export default router;
