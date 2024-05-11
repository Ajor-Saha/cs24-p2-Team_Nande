import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { addNewWorker, addWorkHour, getAllWorkerByCompanyName, updateAllWorkedHours } from "../controllers/worker.controller.js";
import { verifyWorkerJWT } from "../middleware/worker.middleware.js";

const router = express.Router();
router.route("/addWorker").post(verifyJWT, addNewWorker);
router.route("/getAllWorkerByCompanyName/:companyName").get(verifyJWT, getAllWorkerByCompanyName);
router.route("/addWorkHour").post(verifyWorkerJWT, addWorkHour);
router.route("/updateWorkHour").put(verifyJWT, updateAllWorkedHours);

export default router;
