import { v4 as uuidv4 } from "uuid";
import { Contractor } from "../models/contractor.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { STS } from "../models/sts.model.js";
import { User } from "../models/user.model.js";
import { CompanyVehicle } from "../models/companyVehicle.model.js";
import { ContractorEntry } from "../models/contractorEntry.js";
import { WorkedHour } from "../models/workHour.model.js";
import { Worker } from "../models/worker.model.js";
import { WasteCollectionPlan } from "../models/wasteCollection.model.js";

const addContractor = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    throw new ApiError(401, "You are not allowed");
  }

  const {
    contractId,
    registrationDate,
    tin,
    contactNumber,
    workforceSize,
    paymentPerTonnage,
    requiredWastePerDay,
    contractDuration,
    latitude,
    longitude,
    designatedSTS,
  } = req.body;

  if (
    ![
      companyName,
      contractId,
      registrationDate,
      tin,
      contactNumber,
      workforceSize,
      paymentPerTonnage,
      requiredWastePerDay,
      contractDuration,
      latitude,
      longitude,
      designatedSTS,
    ].every((field) => field !== undefined)
  ) {
    throw new ApiError(401, "All fields are required");
  }

  const existContractor = await Contractor.findOne({ companyName });

  if (existContractor) {
    throw new ApiError(401, "This company name is already exist");
  }

  const stsExist = await STS.findOne({ ward_number: designatedSTS });

  if (!stsExist) {
    throw new ApiError(401, "Sts not found");
  }

  // Generate a random unique string for registrationId
  const registrationId = generateRegistrationId();

  const newContractor = await Contractor.create({
    companyName: req.user.contructorCompany,
    contractId,
    registrationId,
    registrationDate,
    tin,
    contactNumber,
    workforceSize,
    paymentPerTonnage,
    requiredWastePerDay,
    contractDuration,
    areaOfCollection: {
      latitude,
      longitude,
    },
    designatedSTS,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(200, newContractor, "New Contractor created successfully")
    );
});

// Helper function to generate a random unique string for registrationId
const generateRegistrationId = () => {
  // Generate a random UUID (Universally Unique Identifier)
  return uuidv4();
};

const getAllContractors = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    throw new ApiError(401, "You are not allowed");
  }

  const contractors = await Contractor.find();

  return res
    .status(201)
    .json(
      new ApiResponse(200, contractors, "All contructors fetched successfully")
    );
});

const deleteContractor = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    throw new ApiError(401, "You are not allowed to delete contractors");
  }

  const { companyName } = req.body;

  if (!companyName) {
    throw new ApiError(400, "Company name is required");
  }

  const contractor = await Contractor.findOne({ companyName });

  if (!contractor) {
    throw new ApiError(404, "Contractor not found");
  }

  const deletedContructor = await Contractor.findOneAndDelete({ companyName });

  return res
    .status(201)
    .json(
      new ApiResponse(200, {}, `Contructor ${companyName} deleted Successfully`)
    );
});

const getContractorByCompanyName = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    throw new ApiError(401, "You are not allowed");
  }

  const { companyName } = req.params;

  if (!companyName) {
    throw new ApiError(400, "Company name is required");
  }

  const contractor = await Contractor.findOne({ companyName }).populate(
    "managers"
  );

  if (!contractor) {
    throw new ApiError(404, "Contractor not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, contractor, "Contractor fetched successfully"));
});

const getAvailableContractorManagers = asyncHandler(async (req, res) => {
  try {
    // Check if the user is authorized to access this endpoint
    if (!req.user.isAdmin) {
      throw new ApiError(
        401,
        "You are not authorized to access this resource."
      );
    }

    // Fetch all contractors
    const contractors = await Contractor.find();

    // Extract all manager user IDs from contractors
    const managerUserIds = contractors.reduce((acc, contractor) => {
      return acc.concat(contractor.managers);
    }, []);

    // Find users with role 'Contractor Manager' who are not yet assigned to any contractor
    const availableManagers = await User.find({
      role: "Contractor Manager",
      _id: { $nin: managerUserIds }, // Filter out users already assigned to contractors
    });

    // Return the filtered users
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          availableManagers,
          "Available Contractor Managers fetched successfully"
        )
      );
  } catch (error) {
    // Handle errors
    console.error("Error fetching available contractor managers:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
});

const assignContractorManagers = asyncHandler(async (req, res) => {
  // Extract userId from request params
  const { userId } = req.params;
  // Extract companyName from request body
  const { companyName } = req.body;

  // Find the Contractor based on companyName
  const contractor = await Contractor.findOne({ companyName });

  if (!contractor) {
    throw new ApiError(404, "Contractor not found");
  }

  // Check if the userId is already present in the managers array
  if (contractor.managers.includes(userId)) {
    throw new ApiError(400, "User is already a manager for this contractor");
  }

  const existUser = await User.findById({ _id: userId });

  if (!existUser) {
    throw new ApiError(401, "User not found");
  }

  existUser.contructorCompany = companyName;
  await existUser.save();

  // Add the userId to the managers array
  contractor.managers.push(userId);

  // Save the updated Contractor document
  await contractor.save();

  // Return success response
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        contractor,
        "Manager assigned to Contractor successfully"
      )
    );
});

const findContractorByUserId = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }

  // Find the contractor where the managers array contains the given userId
  const contractor = await Contractor.findOne({ managers: userId })
    .populate("managers", "-password -refreshToken") // Populate the managers details
    .select("-vehicles -workers"); // Exclude vehicles and workers details from the response

  if (!contractor) {
    throw new ApiError(404, "Contractor not found for the given user");
  }

  // Return the details of the contractor for the given user
  return res
    .status(200)
    .json(new ApiResponse(200, contractor, "Contractor found successfully"));
});

const addCompanyVehicle = asyncHandler(async (req, res) => {
  const { vehicle_reg_number, type } = req.body;
  const { companyName } = req.params;

  // Check if the required fields are provided
  if (!vehicle_reg_number || !type) {
    throw new ApiError(
      400,
      "Vehicle registration number and type are required"
    );
  }

  // Check if the company exists
  const companyExists = await Contractor.findOne({ companyName });
  if (!companyExists) {
    throw new ApiError(404, "Company not found");
  }

  // Create a new company vehicle entry
  const newCompanyVehicle = await CompanyVehicle.create({
    vehicle_reg_number,
    companyName,
    type,
  });

  // Send success response
  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        newCompanyVehicle,
        "Company vehicle added successfully"
      )
    );
});

const addContractorEntry = asyncHandler(async (req, res) => {
  const { vehicle_reg_number, weightOfWaste } = req.body;
  const { companyName } = req.params;

  // Check if the required fields are provided
  if (!vehicle_reg_number || !weightOfWaste) {
    throw new ApiError(
      400,
      "Vehicle registration number and waste are required"
    );
  }

  // Check if the company exists
  const companyExists = await Contractor.findOne({ companyName });
  if (!companyExists) {
    throw new ApiError(404, "Company not found");
  }

  // Create a new company vehicle entry
  const newContractorEntry = await ContractorEntry.create({
    vehicle_reg_number,
    companyName,
    weightOfWaste,
  });

  // Send success response
  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        newContractorEntry,
        "Contractor Entry added successfully"
      )
    );
});

const getContractorEntriesByCompany = asyncHandler(async (req, res) => {
  const { companyName } = req.params;

  try {
    // Retrieve all contractor entries by company name
    const entries = await ContractorEntry.find({ companyName });

    // Send success response with the retrieved entries
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          entries,
          `Contractor entries retrieved successfully for company ${companyName}`
        )
      );
  } catch (error) {
    throw new ApiError(
      500,
      "Failed to retrieve contractor entries: " + error.message
    );
  }
});

const getAllWorkersAndWorkHours = asyncHandler(async (req, res) => {
  try {
    const { companyName } = req.params;

    // Find all workers associated with the company
    const workers = await Worker.find({ contractorCompany: companyName });

    // Extract employeeIds of all workers
    const employeeIds = workers.map((worker) => worker.employeeId);

    // Find all work hours based on employeeIds
    const workHours = await WorkedHour.find({
      employeeId: { $in: employeeIds },
    });

    return res.status(200).json({
      success: true,
      data: workHours,
      message: "Worked hours fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching worked hours:", error);
    throw new ApiError(500, "Failed to fetch worked hours");
  }
});

const addWasteCollectionPlan = asyncHandler(async (req, res) => {
  const {
    areaOfCollection,
    collectionStartTime,
    durationForCollection,
    numberOfLaborers,
    numberOfVans,
    expectedWeightOfDailyWaste,
  } = req.body;

  // Check if all required fields are provided
  if (
    !areaOfCollection ||
    !collectionStartTime ||
    !durationForCollection ||
    !numberOfLaborers ||
    !numberOfVans ||
    !expectedWeightOfDailyWaste
  ) {
    throw new ApiError(401, "You not allowed");
  }

  try {
    // Create a new waste collection plan
    const newWasteCollectionPlan = await WasteCollectionPlan.create({
      areaOfCollection,
      collectionStartTime,
      durationForCollection,
      numberOfLaborers,
      numberOfVans,
      expectedWeightOfDailyWaste,
      managerId: req.user._id,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          newWasteCollectionPlan,
          `Waste collection plan added successfully`
        )
      );
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to add waste collection plan",
        error: error.message,
      });
  }
});

const getAllWasteCollectionPlan = asyncHandler(async (req, res) => {
  try {
    // Find all waste collection plans associated with the user
    const wasteCollectionPlans = await WasteCollectionPlan.find({
      managerId: req.user._id,
    });

    // Check if any waste collection plans were found
    if (!wasteCollectionPlans.length) {
      throw new ApiError(401, "waste collection not found")
    }

    // Return the waste collection plans

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          wasteCollectionPlans,
          `Waste collection plans retrieved successfully`
        )
      );
   
  } catch (error) {
    // Handle errors
    return res.status(500).json({
      success: false,
      message: "Failed to fetch waste collection plans",
      error: error.message,
    });
  }
});


export {
  addContractor,
  getAllContractors,
  deleteContractor,
  getContractorByCompanyName,
  getAvailableContractorManagers,
  assignContractorManagers,
  findContractorByUserId,
  addCompanyVehicle,
  addContractorEntry,
  getContractorEntriesByCompany,
  getAllWorkersAndWorkHours,
  addWasteCollectionPlan,
  getAllWasteCollectionPlan
};
