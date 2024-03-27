import { Role } from "../models/role.model.js";
import { STS } from "../models/sts.model.js";
import { User } from "../models/user.model.js";
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
    .json(new ApiResponse(200, sts, "STS details retrieve successfully"));
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
    .json(new ApiResponse(200, {}, "STS deleted successfully"));
});

const assignManagerToSTS = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    throw new ApiError(401, "You are not authorized");
  }

  const { stsId, userId } = req.params;

  
  const sts = await STS.findById({ _id:stsId });

  if (!sts) {
    throw new ApiError(404, "STS not found");
  }

  // Check if user exists
  const user = await User.findById({ _id:userId }).populate("role");

  if (!user || user.role.name !== 'STS Manager') {
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

    const user = await User.findById({ _id:userId })

    if (!user) {
        throw new ApiError(401, "User not found");
    }
    // Check if the user is a manager for this STS
    if (!sts.managers.includes(userId)) {
      throw new ApiError(404, "User is not a manager for this STS");
    }
  
    // Remove the user from the managers list of the STS
    sts.managers = sts.managers.filter(managerId => managerId.toString() !== userId);
    await sts.save();
  
    return res.status(201).json(new ApiResponse(201, sts, "Manager removed from STS successfully"));
});


const getAvailableSTSManager = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    throw new ApiError(401, "You are not authorized");
  }
  try {
    const usersWithRoles = await User.find({ role: { $ne: null } });
    const stsManagerRole = await Role.findOne({ name: 'STS Manager' });

    if (!stsManagerRole) {
      throw new ApiError(401, "STS manager role not found");
    }

    const stsManagerRoleId = stsManagerRole._id;
    const stsManagerUsers = usersWithRoles.filter(user => user.role.equals(stsManagerRoleId));
    
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

    return res.status(201).json(new ApiResponse(201, stsManagersWithNoMatchingSTS, "STS successfully"));
  } catch (error) {
    console.error('Error in getting available STS Managers:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get available STS Managers',
      error: error.message,
    });
  }
});




export {
     addSTS,
     getAllSTS,
     getSTSByWardNumber,
     deleteSTS,
     assignManagerToSTS,
     deleteManagerSTS,
     getAvailableSTSManager
};
