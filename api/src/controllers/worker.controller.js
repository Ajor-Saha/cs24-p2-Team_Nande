import { WorkedHour } from "../models/workHour.model.js";
import { Worker } from "../models/worker.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addNewWorker = asyncHandler(async (req, res) => {
  if (req.user.role !== "Contractor Manager") {
    throw new ApiError(401, "You are not authorized");
  }

  // Corrected typo here

  const {
    fullName,
    email,
    password,
    phoneNumber,
    employeeId,
    dateOfBirth,
    dateOfHire,
    jobTitle,
    paymentRatePerHour,
    latitude,
    longitude,
  } = req.body;

  if ([email, fullName, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await Worker.findOne({ email });

  if (existedUser) {
    throw new ApiError(401, "User with this email already exists");
  }

  const newWorker = await Worker.create({
    contractorCompany: req.user.contructorCompany, // Corrected typo here
    fullName,
    email,
    password,
    phoneNumber,
    dateOfBirth,
    dateOfHire,
    jobTitle,
    paymentRatePerHour,
    assignedCollectionRoute: {
      latitude,
      longitude,
    },
    employeeId,
    role: "Worker",
  });

  const createdWorker = await Worker.findById(newWorker._id).select(
    "-password -refreshToken"
  );

  if (!createdWorker) {
    throw new ApiError(
      401,
      "Something went wrong while registering the worker"
    );
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdWorker, "Worker created Successfully"));
});

const getAllWorkerByCompanyName = asyncHandler(async (req, res) => {
  if (req.user.role !== "Contractor Manager") {
    throw new ApiError(401, "You are not authorized");
  }

  const { companyName } = req.params; // Assuming the company name is sent in the request body

  if (!companyName) {
    throw new ApiError(400, "Company name is required");
  }

  // Find all workers with the given company name
  const workers = await Worker.find({ contractorCompany: companyName }).select(
    "-refreshToken"
  );

  if (!workers) {
    throw new ApiError(404, "No workers found for the given company");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, workers, "Workers retrieved successfully"));
});

const addWorkHour = asyncHandler(async (req, res) => {
  const { employeeId, date, logInTime, logOutTime } = req.body;

  // Check if the employeeId and date are provided
  if (!employeeId || !date) {
    throw new ApiError(400, "Employee ID and Date are required");
  }

  const employee = await Worker.findOne({employeeId});

  if (!employee) {
    throw new ApiError(401, "Employ not found");
  }

  // Create a new work hour entry
  const newWorkHour = await WorkedHour.create({
    employeeId,
    date,
    logInTime,
    logOutTime,
  });

  // Send success response
  return res
    .status(201)
    .json(new ApiResponse(201, newWorkHour, "Work hour added successfully"));
});


const updateAllWorkedHours = asyncHandler(async (req, res) => {
  try {
    // Fetch all documents from the WorkedHour collection
    const allWorkedHours = await WorkedHour.find();

    // Update each document with the calculated totalHoursWorked and overtimeHours
    const updatedWorkedHours = await Promise.all(
      allWorkedHours.map(async (workedHour) => {
        const { logInTime, logOutTime } = workedHour;

        // Calculate total hours worked
        const logIn = new Date(`2000-01-01T${logInTime}`);
        const logOut = new Date(`2000-01-01T${logOutTime}`);
        const totalMilliseconds = logOut - logIn;
        const totalHoursWorked = totalMilliseconds / (1000 * 60 * 60); // Convert milliseconds to hours

        // Calculate overtime hours
        const standardWorkingHours = 8; // Assuming 8 hours is standard working hours
        const overtimeHours = Math.max(totalHoursWorked - standardWorkingHours, 0);

        // Update the document with the calculated values
        workedHour.totalHoursWorked = totalHoursWorked;
        workedHour.overtimeHours = overtimeHours;

        // Save the updated document
        await workedHour.save();

        return workedHour;
      })
    );

    // Send success response with the updated documents
    return res
    .status(201)
    .json(new ApiResponse(201, updatedWorkedHours, "All worked hours updated successfully"));
  } catch (error) {
    console.error("Error updating worked hours:", error);
    return res.status(500).json({ error: "Failed to update worked hours" });
  }
});


export { addNewWorker, getAllWorkerByCompanyName, addWorkHour, updateAllWorkedHours };
