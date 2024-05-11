import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { STSVehiclesList, addSTS, addSTSEntry, addSTSEntryContractor, assignManagerToSTS, deleteManagerSTS, deleteSTS, fetchContractors, findOptimalVehicles, findSTSEntriesBySTSId, findUserSTS, generateBillForContractor, getAllSTS, getAllSTSEntries, getAllSTSEntryContractor, getAvailableSTSManager, getOptimizedTruck, getSTSByWardNumber, getSTSDetailsWithTotalWaste, getSTSEntriesForThisWeek, getSTSVehicles } from "../controllers/sts.controller.js";

const router = express.Router();
router.route("/addsts").post(verifyJWT, addSTS);
router.route("/getallsts").get(verifyJWT, getAllSTS);
router.route("/getsts/:ward_number").get(verifyJWT, getSTSByWardNumber);
router.route("/deletests/:ward_number").delete(verifyJWT, deleteSTS);
router.route("/assignsts/:stsId/:userId").put(verifyJWT, assignManagerToSTS);
router.route("/delestsmanager/:stsId/:userId").delete(verifyJWT, deleteManagerSTS);
router.route("/getavailablestsmanagers").get(verifyJWT, getAvailableSTSManager);
router.route("/userstsdetails/:userId").get(findUserSTS);
router.route("/addstsentry/:sts_id").post(addSTSEntry);
router.route("/getstsentries/:sts_id").get(findSTSEntriesBySTSId);
router.route("/getallstswaste").get(verifyJWT, getSTSDetailsWithTotalWaste)
router.route("/getrecenttransportation").get(verifyJWT, getSTSEntriesForThisWeek);
router.route("/getvehicleofsts/:ward_number").get(verifyJWT, getSTSVehicles);
router.route("/stsVehicleList/:userId").get(STSVehiclesList);
router.route("/getOptimizedVehicles/:ward_number").post(verifyJWT, getOptimizedTruck);
router.route("/getallstsEntries").get(verifyJWT, getAllSTSEntries);
router.route("/findOptimalVehicles/:ward_number").post(findOptimalVehicles);
router.route("/addSTSEntryForContractor").post(addSTSEntryContractor);
router.route("/getstsEntryContractor/:ward_number").get(getAllSTSEntryContractor);
router.route("/getcontractorByWard/:ward_number").get(fetchContractors);
router.route("/generateBillForContractor/:contractId").get(generateBillForContractor);

export default router;
