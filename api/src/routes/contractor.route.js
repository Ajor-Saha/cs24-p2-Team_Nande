import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { addCompanyVehicle, addContractor, addContractorEntry, addWasteCollectionPlan, assignContractorManagers, findContractorByUserId, getAllContractors, getAllWasteCollectionPlan, getAllWorkersAndWorkHours, getAvailableContractorManagers, getContractorByCompanyName, getContractorEntriesByCompany } from "../controllers/contractor.controller.js";

const router = express.Router();
router.route("/addContractor").post(verifyJWT, addContractor);
router.route("/assignContructorManager/:userId").put(verifyJWT, assignContractorManagers);
router.route("/getAllContractor").get(verifyJWT, getAllContractors);
router.route("/getContructorbyName/:companyName").get(verifyJWT, getContractorByCompanyName)
router.route("/getContactorManagers").get(verifyJWT, getAvailableContractorManagers);
router.route("/getContractorDetailsById").get(verifyJWT, findContractorByUserId);
router.route("/addCompanyVehicle/:companyName").post(addCompanyVehicle);
router.route("/addContractorEntry/:companyName").post(addContractorEntry);
router.route("/getContractorEntryByCompanyName/:companyName").get(getContractorEntriesByCompany);
router.route("/getAllWorkersAndWorkHours/:companyName").get(verifyJWT, getAllWorkersAndWorkHours);
router.route("/addWasteCollection").post(verifyJWT, addWasteCollectionPlan);
router.route("/getAllWasteCollection").get(verifyJWT, getAllWasteCollectionPlan);

export default router;
