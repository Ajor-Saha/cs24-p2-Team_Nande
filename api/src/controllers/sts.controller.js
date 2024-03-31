import { Role } from "../models/role.model.js";
import { STS } from "../models/sts.model.js";
import { STSEntry } from "../models/stsEntry.model.js";
import { User } from "../models/user.model.js";
import { Vehicle } from "../models/vehicle.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addSTS = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    throw new ApiError(401, "You are not authorized");
  }

  const { ward_number, capacity, latitude, longitude } = req.body;

  if (
    ![ward_number, capacity, latitude, longitude].every(
      (field) => field !== undefined
    )
  ) {
    throw new ApiError(401, "All fields are required");
  }

  const existSTS = await STS.findOne({ ward_number });

  if (existSTS) {
    throw new ApiError(401, "STS with this ward_number already exist");
  }

  const newSTS = await STS.create({
    ward_number,
    capacity,
    gps_coordinates: {
      latitude,
      longitude,
    },
  });

  return res
    .status(201)
    .json(new ApiResponse(201, newSTS, "STS added successfully"));
});

const getAllSTS = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    throw new ApiError(401, "You are not authorized");
  }

  const sts = await STS.find();

  return res
    .status(201)
    .json(new ApiResponse(200, sts, "All sts retrieve successfully"));
});

const getSTSByWardNumber = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    throw new ApiError(401, "You are not authorized");
  }

  const { ward_number } = req.params;

  const sts = await STS.findOne({ ward_number });

  if (!sts) {
    throw new ApiError(401, "STS with that ward number not exists");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, sts, `STS ${ward_number} details retrieve successfully`));
});

const deleteSTS = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    throw new ApiError(401, "You are not authorized");
  }

  const { ward_number } = req.params;

  const sts = await STS.findOneAndDelete({ ward_number });

  if (!sts) {
    throw new ApiError(404, "STS not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, `STS ${ward_number} deleted successfully`));
});

const assignManagerToSTS = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    throw new ApiError(401, "You are not authorized");
  }

  const { stsId, userId } = req.params;

  const sts = await STS.findById({ _id: stsId });

  if (!sts) {
    throw new ApiError(404, "STS not found");
  }

  // Check if user exists
  const user = await User.findById({ _id: userId }).populate("role");

  if (!user || user.role.name !== "STS Manager") {
    throw new ApiError(404, "User not found or not an STS Manager");
  }

  if (sts.managers.includes(userId)) {
    throw new ApiError(400, "User is already a manager for this STS");
  }

  // Add user as a manager for this STS
  sts.managers.push(userId);
  await sts.save();

  return res
    .status(200)
    .json(new ApiResponse(200, sts, "Manager assigned to STS successfully"));
});

const deleteManagerSTS = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    throw new ApiError(401, "You are not authorized");
  }

  const { stsId, userId } = req.params;

  // Check if STS exists
  const sts = await STS.findById(stsId);
  if (!sts) {
    throw new ApiError(404, "STS not found");
  }

  const user = await User.findById({ _id: userId });

  if (!user) {
    throw new ApiError(401, "User not found");
  }
  // Check if the user is a manager for this STS
  if (!sts.managers.includes(userId)) {
    throw new ApiError(404, "User is not a manager for this STS");
  }

  // Remove the user from the managers list of the STS
  sts.managers = sts.managers.filter(
    (managerId) => managerId.toString() !== userId
  );
  await sts.save();

  return res
    .status(201)
    .json(new ApiResponse(201, sts, "Manager removed from STS successfully"));
});

const getAvailableSTSManager = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    throw new ApiError(401, "You are not authorized");
  }
  try {
    const usersWithRoles = await User.find({ role: { $ne: null } });
    const stsManagerRole = await Role.findOne({ name: "STS Manager" });

    if (!stsManagerRole) {
      throw new ApiError(401, "STS manager role not found");
    }

    const stsManagerRoleId = stsManagerRole._id;
    const stsManagerUsers = usersWithRoles.filter((user) =>
      user.role.equals(stsManagerRoleId)
    );

    // Array to store stsManagerUsers with no matching STS managers
    const stsManagersWithNoMatchingSTS = [];

    // Find all STS documents
    const allSTS = await STS.find({});

    // Iterate over each stsManagerUser and check if its _id matches any manager in STS model
    for (const stsManagerUser of stsManagerUsers) {
      let matched = false;
      for (const sts of allSTS) {
        if (sts.managers.includes(stsManagerUser._id)) {
          matched = true;
          break;
        }
      }
      if (!matched) {
        stsManagersWithNoMatchingSTS.push(stsManagerUser);
      }
    }

    return res
      .status(201)
      .json(
        new ApiResponse(201, stsManagersWithNoMatchingSTS, "Sts managerList without assign any sts")
      );
  } catch (error) {
    console.error("Error in getting available STS Managers:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get available STS Managers",
      error: error.message,
    });
  }
});

const findUserSTS = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  // Find STS where the user is a manager
  const sts = await STS.findOne({ managers: { $in: [userId] } }).populate(
    "managers"
  );

  if (!sts) {
    throw new ApiError(401, "User is not associated with any STS ");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, sts, "user STS retrieve successfully"));
});

const addSTSEntry = async (req, res) => {
  
  const { sts_id } = req.params;
  const {
    vehicle_reg_number,
    weight_of_waste,
    time_of_arrival,
    time_of_departure,
    distance_traveled,
  } = req.body;

  // Check if the provided sts_id exists
  const stsExists = await STS.findById({ _id:sts_id });
  if (!stsExists) {
    throw new ApiError(401, "STS not found");
  }

  // Check if the vehicle_reg_number exists in the STS's vehicles array
  if (!stsExists.vehicles.includes(vehicle_reg_number)) {
    throw new ApiError(401, "Vehicle not assigned to this STS");
  }

  // Create a new stsEntry
  const newSTSEntry = new STSEntry({
    sts_id,
    vehicle_reg_number,
    weight_of_waste,
    time_of_arrival,
    time_of_departure,
    distance_traveled,
  });

  // Save the new stsEntry
  await newSTSEntry.save();

  res
    .status(201)
    .json(new ApiResponse(201, newSTSEntry, "STS Entry added successfully"));
};

const findSTSEntriesBySTSId = async (req, res) => {
  try {
    const { sts_id } = req.params;

    // Find all STSEntry documents with the given sts_id
    const stsEntries = await STSEntry.find({ sts_id });

    if (!stsEntries || stsEntries.length === 0) {
      throw new ApiError(401, "No stsEntry found for this sts")
    }

    res
    .status(201)
    .json(new ApiResponse(201, stsEntries, "STS entries retrieve successfully"));
  } catch (error) {
    console.error("Error finding STSEntries:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



const getSTSDetailsWithTotalWaste = async (req, res) => {
  if (!req.user.isAdmin) {
    throw new ApiError(401, "You are not authorized");
  }
  try {
    // Get the date one month ago
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    // Fetch all STS entries from the STS model
    const stsEntries = await STS.find({}, '_id ward_number capacity');

    const stsDetailsWithTotalWaste = [];

    // Iterate through each STS entry
    for (const stsEntry of stsEntries) {
      // Fetch all STSEntries for the current STS entry created within the last month
      const stsEntryDetails = await STSEntry.find({
        sts_id: stsEntry._id,
        createdAt: { $gte: oneMonthAgo }
      }, 'weight_of_waste');

      // Calculate total waste for the current STS entry
      const totalWaste = stsEntryDetails.reduce((total, entry) => total + entry.weight_of_waste, 0);

      // Create an object with ward_number, capacity, and total waste
      const stsDetail = {
        ward_number: stsEntry.ward_number,
        capacity: stsEntry.capacity,
        totalWaste: totalWaste
      };

      // Push the result to the array
      stsDetailsWithTotalWaste.push(stsDetail);
    }

    // Send the array as a response
    res.status(201).json(new ApiResponse(201, stsDetailsWithTotalWaste, "STS entries retrieved successfully"));
  } catch (error) {
    console.error('Error retrieving STS details with total waste:', error);
    res.status(500).json({ error: 'Failed to retrieve STS details with total waste' });
  }
};

const getSTSEntriesForThisWeek = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    throw new ApiError(401, "You are not authorized");
  }

  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const stsEntries = await STSEntry.find({
      createdAt: { $gte: oneWeekAgo },
    })
      .populate({
        path: "sts_id",
        select: "ward_number",
        model: "STS",
      })
      .select("sts_id vehicle_reg_number weight_of_waste");

    // Extract relevant data and format the response
    const formattedData = stsEntries.map((entry) => ({
      ward_number: entry.sts_id.ward_number,
      vehicle_reg_number: entry.vehicle_reg_number,
      weight_of_waste: entry.weight_of_waste,
    }));

    res.status(201).json(new ApiResponse(201, formattedData, "STS entries for this week retrieved successfully"));

  } catch (error) {
    console.error("Error fetching STS entries for this week:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch STS entries for this week",
    });
  }
});

const getSTSVehicles = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    throw new ApiError(401, "You are not authorized");
  }

  const { ward_number } = req.params;

  // Find the STS with the given ward number
  const sts = await STS.findOne({ ward_number });

  if (!sts) {
    throw new ApiError(404, "STS with that ward number does not exist");
  }

  // Array to store vehicle details
  const vehiclesDetails = [];

  // Iterate through each vehicle ID in the STS's vehicles array
  for (const vehicleId of sts.vehicles) {
    // Find the vehicle details using the vehicle ID
    const vehicle = await Vehicle.findOne({ vehicle_reg_number: vehicleId });
    
    if (!vehicle) {
      // If vehicle details are not found, skip to the next vehicle
      continue;
    }

    // Push the vehicle details into the array
    vehiclesDetails.push(vehicle);
  }

  return res.status(201).json(new ApiResponse(201, vehiclesDetails, `Vehicle details retrieved of ${ward_number} sts  successfully`));
});



export {
  addSTS,
  getAllSTS,
  getSTSByWardNumber,
  deleteSTS,
  assignManagerToSTS,
  deleteManagerSTS,
  getAvailableSTSManager,
  findUserSTS,
  addSTSEntry,
  findSTSEntriesBySTSId,
  getSTSDetailsWithTotalWaste,
  getSTSEntriesForThisWeek,
  getSTSVehicles
};
