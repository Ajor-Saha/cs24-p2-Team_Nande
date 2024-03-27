import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { addVehicle, deleteVehicle, getAllVehicle, getVehicleByRegNumber, updateVehicle } from "../controllers/vehicle.controller.js";

const router = express.Router();
router.route("/addvehicle").post(verifyJWT, addVehicle);
router.route("/getvehicle/:vehicle_reg_number").get(verifyJWT, getVehicleByRegNumber);
router.route("/getallvehicle").get(verifyJWT, getAllVehicle);
router.route("/deletevehicle/:vehicle_reg_number").delete(verifyJWT, deleteVehicle);
router.route("/updatevehicle/:vehicle_reg_number").put(verifyJWT, updateVehicle);

export default router;
