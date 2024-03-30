import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  addRole,
  assignPermissionsToRole,
  deletePermissionForRole,
  deleteRole,
  getPermissionsForRole,
  getRoleById,
  getRoles,
  getroleCount,
  updateRole,
} from "../controllers/role.controller.js";

const router = express.Router();
router.route("/roles").post(verifyJWT, addRole);
router.route("/roles").get(verifyJWT, getRoles);
router.route("/roles/:roleId").get(verifyJWT, getRoleById);
router.route("/roles/:roleId").put(verifyJWT, updateRole);
router.route("/roles/:roleId").delete(verifyJWT, deleteRole);
router
  .route("/roles/:roleId/permissions")
  .post(verifyJWT, assignPermissionsToRole);
router
  .route("/roles/:roleId/permissions")
  .get(verifyJWT, getPermissionsForRole);
router
  .route("/roles/:roleId/permissions")
  .put(verifyJWT, deletePermissionForRole);

router
  .route("/rol")
  .get(verifyJWT, getroleCount);
export default router;
