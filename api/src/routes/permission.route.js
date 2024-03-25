import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { addPermission, deletePermission, getPermissions, updatePermission } from "../controllers/permission.controller.js";


const router = express.Router();
router.route("/permissions").post(verifyJWT, addPermission);
router.route("/permissions").get(verifyJWT, getPermissions);
router.route("/permissions/:permissionId").put(verifyJWT, updatePermission);
router.route("/permissions/:permissionId").delete(verifyJWT, deletePermission);

export default router;
