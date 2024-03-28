import { Landfill } from "../models/landFill.model.js";
import { User } from "../models/user.model.js";
import { Role } from "../models/role.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addLandFill = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    throw new ApiError(401, "You are not authorized");
  }

  const { name, capacity, startTime, endTime, latitude, longitude } = req.body;

  if (
    ![name, capacity, startTime, endTime, latitude, longitude].every(
      (field) => field !== undefined
    )
  ) {
    throw new ApiError(401, "All fields are required");
  }

  const existSTS = await Landfill.findOne({ name });

  if (existSTS) {
    throw new ApiError(401, "LandFill with this name already exist");
  }

  const newLandfil = await Landfill.create({
    name,
    capacity,
    operationalTimespan: {
      startTime,
      endTime,
    },
    gps_coordinates: {
      latitude,
      longitude,
    },
  });

  return res
    .status(201)
    .json(new ApiResponse(201, newLandfil, "Landfill added successfully"));
});

const getAllLandfill = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    throw new ApiError(401, "You are not authorized");
  }

  const landFill = await Landfill.find();

  return res
    .status(201)
    .json(new ApiResponse(200, landFill, "All landfill retrieve successfully"));
});

const getlandFillByName = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    throw new ApiError(401, "You are not authorized");
  }

  const { name } = req.params;

  const landFill = await Landfill.findOne({ name });

  if (!landFill) {
    throw new ApiError(401, "Landfill with that name not exists");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, landFill, "Landfill details retrieve successfully"));
});

const deleteLandfill = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    throw new ApiError(401, "You are not authorized");
  }

  const { name } = req.params;

  const LandFill = await Landfill.findOneAndDelete({ name });

  if (!LandFill) {
    throw new ApiError(404, "Landfill not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Landfill deleted successfully"));
});

const getAvailableLandfillManager = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    throw new ApiError(401, "You are not authorized");
  }
  try {
    const usersWithRoles = await User.find({ role: { $ne: null } });
    const landfillManagerRole = await Role.findOne({ name: 'LandFill Manager' });

    if (!landfillManagerRole) {
      throw new ApiError(401, "Landfill manager role not found");
    }

    const landfillManagerRoleId = landfillManagerRole._id;
    const landfillManagerUsers = usersWithRoles.filter(user => user.role.equals(landfillManagerRoleId));
    
    // Array to store stsManagerUsers with no matching STS managers
    const landfillManagersWithNoMatchingLandfill = [];

    // Find all STS documents
    const alllandfill = await Landfill.find({});

    // Iterate over each stsManagerUser and check if its _id matches any manager in STS model
    for (const landfillManagerUser of landfillManagerUsers) {
      let matched = false;
      for (const landfill of alllandfill) {
        if (landfill.manager.includes(landfillManagerUser._id)) {
          matched = true;
          break;
        }
      }
      if (!matched) {
        landfillManagersWithNoMatchingLandfill.push(landfillManagerUser);
      }
    }

    return res.status(201).json(new ApiResponse(201, landfillManagersWithNoMatchingLandfill, "Available LandFill managers retreive successfully"));
  } catch (error) {
    console.error('Error in getting available STS Managers:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get available STS Managers',
      error: error.message,
    });
  }
});

const assignManagerToLandfill = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    throw new ApiError(401, "You are not authorized");
  }

  const { landfillId, userId } = req.params;

  
  const landfill = await Landfill.findById({ _id:landfillId });

  if (!landfill) {
    throw new ApiError(404, "Landfill not found");
  }

  // Check if user exists
  const user = await User.findById({ _id:userId }).populate("role");

  if (!user || user.role.name !== 'LandFill Manager') {
    throw new ApiError(404, "User not found or not an Lanfill Manager");
  }

  
  if (landfill.manager.includes(userId)) {
    throw new ApiError(400, "User is already a manager for this Lanfill");
  }

  // Add user as a manager for this STS
  landfill.manager.push(userId);
  await landfill.save();

  return res
    .status(200)
    .json(new ApiResponse(200, landfill, "Manager assigned to lanfill successfully"));
});

const deleteManagerlandfill = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    throw new ApiError(401, "You are not authorized");
  }

  const { landfillId, userId } = req.params;

  // Check if STS exists
  const landfill = await Landfill.findById({ _id:landfillId });

  if (!landfill) {
    throw new ApiError(404, "LandFill not found");
  }

  const user = await User.findById({ _id:userId })

  if (!user) {
      throw new ApiError(401, "User not found");
  }
  // Check if the user is a manager for this STS
  if (!landfill.manager.includes(userId)) {
    throw new ApiError(404, "User is not a manager for this Landfill");
  }

  // Remove the user from the managers list of the STS
  landfill.manager = landfill.manager.filter(managerId => managerId.toString() !== userId);
  await landfill.save();

  return res.status(201).json(new ApiResponse(201, landfill, "Manager removed from Landfill successfully"));
});


export {
     addLandFill,
     getAllLandfill,
     getlandFillByName,
     deleteLandfill,
     getAvailableLandfillManager,
     assignManagerToLandfill,
     deleteManagerlandfill
};
