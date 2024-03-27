import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { addSTS, assignManagerToSTS, deleteManagerSTS, deleteSTS, getAllSTS, getSTSByWardNumber } from "../controllers/sts.controller.js";

const router = express.Router();
router.route("/addsts").post(verifyJWT, addSTS);
router.route("/getallsts").get(verifyJWT, getAllSTS);
router.route("/getsts/:ward_number").get(verifyJWT, getSTSByWardNumber);
router.route("/deletests/:ward_number").delete(verifyJWT, deleteSTS);
router.route("/assignsts/:stsId/:userId").put(verifyJWT, assignManagerToSTS);
router.route("/delestsmanager/:stsId/:userId").delete(verifyJWT, deleteManagerSTS);

export default router;
