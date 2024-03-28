import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  addVehicle,
  assignVehicleToSTS,
  checkVehicleAssignment,
  deleteVehicle,
  getAllVehicle,
  getVehicleByRegNumber,
  updateVehicle,
} from "../controllers/vehicle.controller.js";

const router = express.Router();
router.route("/addvehicle").post(verifyJWT, addVehicle);
router
  .route("/getvehicle/:vehicle_reg_number")
  .get(verifyJWT, getVehicleByRegNumber);
router.route("/getallvehicle").get(verifyJWT, getAllVehicle);
router
  .route("/deletevehicle/:vehicle_reg_number")
  .delete(verifyJWT, deleteVehicle);
router
  .route("/updatevehicle/:vehicle_reg_number")
  .put(verifyJWT, updateVehicle);
router
  .route("/checkvehicleassignment/:vehicle_reg_number")
  .get(verifyJWT, checkVehicleAssignment);
router
  .route("/assignvehicle/:vehicle_reg_number")
  .put(verifyJWT, assignVehicleToSTS);

export default router;
