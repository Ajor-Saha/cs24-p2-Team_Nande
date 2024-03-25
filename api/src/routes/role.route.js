import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { addRole, deleteRole, getRoles, updateRole} from "../controllers/role.controller.js";


const router = express.Router();
router.route("/roles").post(verifyJWT, addRole);
router.route("/roles").get(verifyJWT, getRoles);
router.route("/roles/:roleId").put(verifyJWT, updateRole);
router.route("/roles/:roleId").delete(verifyJWT, deleteRole);

export default router;
