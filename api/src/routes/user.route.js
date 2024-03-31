import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  addNewUser,
  deleteUser,
  getAllRoles,
  getAllUsers,
  getLandfillManagerList,
  getManagersList,
  getUnassignedUser,
  getUserById,
  getUsers,
  updateAccountDetails,
  updateUserRoles,
} from "../controllers/user.controller.js";

const router = express.Router();
router.route("/user").get(verifyJWT, getUsers);
router.route("/roles").get(getAllRoles);
router.route("/").get(verifyJWT, getAllUsers);
router.route("/:userId").get(verifyJWT, getUserById);
router.route("/:userId").delete(verifyJWT, deleteUser);
router.route("/:userId").put(verifyJWT, updateAccountDetails);
router.route("/").post(verifyJWT, addNewUser);
router.route("/:userId/roles").put(verifyJWT, updateUserRoles);
router.route("/user/sts").get(verifyJWT, getManagersList);
router.route("/user/landfill").get(verifyJWT, getLandfillManagerList);
router.route("/user/unassigned").get(verifyJWT, getUnassignedUser);


export default router;
