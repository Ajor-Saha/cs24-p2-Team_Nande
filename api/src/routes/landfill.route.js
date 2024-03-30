import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  addLandFill,
  addLandFillEntry,
  assignManagerToLandfill,
  calculateFuelCostAndGeneratePDF,
  calculateFuelCosts,
  deleteLandfill,
  deleteManagerlandfill,
  findLandfillEntries,
  findUserLandfill,
  getAllLandfill,
  getAvailableLandfillManager,
  getTotalWasteCollected,
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
router.route("/finduserlandfill/:userId").get(findUserLandfill);
router.route("/addlandfillentry/:landfill_name").post(addLandFillEntry);
router.route("/findlandfillentries").get(findLandfillEntries);
router.route("/fuel_cost_report/:landEntry_id").get(calculateFuelCostAndGeneratePDF);
router.route("/totalwaste").get(verifyJWT, getTotalWasteCollected);
router.route("/getallfuelcost").get(verifyJWT, calculateFuelCosts);

export default router;
