import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  addLandFill,
  assignManagerToLandfill,
  deleteLandfill,
  deleteManagerlandfill,
  getAllLandfill,
  getAvailableLandfillManager,
  getlandFillByName,
} from "../controllers/landfill.controller.js";

const router = express.Router();
router.route("/addlandfill").post(verifyJWT, addLandFill);
router.route("/getlandfills").get(verifyJWT, getAllLandfill);
router.route("/getlandfill/:name").get(verifyJWT, getlandFillByName);
router.route("/deletelandfill/:name").delete(verifyJWT, deleteLandfill);
router
  .route("/getavailablelandManagers")
  .get(verifyJWT, getAvailableLandfillManager);
router.route("/assignlandfillmanager/:landfillId/:userId").put(verifyJWT, assignManagerToLandfill);
router.route("/deletelandfillmanager/:landfillId/:userId").delete(verifyJWT, deleteManagerlandfill);

export default router;
