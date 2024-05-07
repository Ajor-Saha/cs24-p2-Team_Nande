import { Landfill } from "../models/landFill.model.js";
import { Role } from "../models/role.model.js";
import { STS } from "../models/sts.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getUsers = asyncHandler(async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      throw new ApiError(401, "You are not allowed to see all users");
    }

    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;

    const users = await User.find()
      .sort({ createdAt: sortDirection })
      .skip((page - 1) * perPage)
      .limit(perPage);

    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });

    const totalUsers = await User.countDocuments();

    res.status(201).json({
      users: usersWithoutPassword,
      totalUsers,
    });
  } catch (error) {
    console.log("Error message", error);
  }
});


const getAllUsers = asyncHandler(async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      throw new ApiError(401, "You are not allowed to see all users");
    }

    const users = await User.find()
      
    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });

    const totalUsers = await User.countDocuments();

    res.status(201).json({
      users: usersWithoutPassword,
      totalUsers,
    });
  } catch (error) {
    console.log("Error message", error);
  }
});



const addNewUser = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    throw new ApiError(401, "You are not authorized");
  }

  const { fullName, email, username, password } = req.body;
  //console.log("email: ", email);

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(401, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(401, "User with email or username already exists");
  }
  //console.log(req.files);

  const user = await User.create({
    fullName,
    email,
    password,
    username: username.toLowerCase(),
    isVerified: true,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(401, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User created Successfully"));
});

const getUserById = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    throw new ApiError(401, "You are not authorized");
  }
  const { userId } = req.params;
  const user = await User.findById({ _id: userId });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const usersWithoutPassword = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return res
    .status(201)
    .json(
      new ApiResponse(201, usersWithoutPassword, "User retrieve Successfully")
    );
});

const deleteUser = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    throw new ApiError(401, "You are not authorized");
  }

  const { userId } = req.params;

  // Check if the user exists
  const user = await User.findById({ _id:userId });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Check if the user is associated with any STS
  const sts = await STS.findOneAndUpdate(
    { managers: userId },
    { $pull: { managers: userId } }
  );

  // Check if the user is associated with any Landfill
  const landfill = await Landfill.findOneAndUpdate(
    { manager: userId },
    { $pull: { manager: userId } }
  );

  // Delete the user
  const deletedUser = await User.findByIdAndDelete({ _id:userId });

  if (!deletedUser) {
    throw new ApiError(401, "User could not be deleted");
  }

  return res.status(201).json(new ApiResponse(201, {}, "User deleted successfully"));
});


const updateAccountDetails = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    throw new ApiError(401, "You are not authorized");
  }

  const { userId } = req.params;

  const { fullName, email, username } = req.body;

  // Check if any required fields are missing
  if (!fullName && !email && !username) {
    throw new ApiError(400, "At least one field is required for update");
  }

  const user = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        fullName: fullName,
        email: email,
        username: username,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(201)
    .json(new ApiResponse(201, user, "Account details updated successfully"));
});

const updateUserRoles = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    throw new ApiError(401, "You are not allowed");
  }
  
  const { userId } = req.params;
  const { role } = req.body;
  
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(401, "User not found");
  }

  // Validate the requested role
  if (!["Admin", "STS Manager", "Landfill Manager", "Unassigned"].includes(role)) {
    throw new ApiError(401, `Invalid role: ${role}`);
  }

  // Update user's role
  user.role = role;

  // If the requested role is 'Admin', update isAdmin field to true
  user.isAdmin = role === "Admin";

  await user.save();

  const updatedUser = await User.findById(user._id).select("-password -refreshToken");

  return res.status(201).json(new ApiResponse(201, updatedUser, "User role updated successfully"));
});


const getManagersList = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    throw new ApiError(401, "You are not allowed");
  }

  // Find all STS documents where the managers field is not empty
  const stsList = await STS.find({ managers: { $exists: true, $not: { $size: 0 } } })
    .select('ward_number managers') // Select both ward_number and managers fields

  // Iterate through each STS document to fetch user details for managers
  const populatedStsList = await Promise.all(stsList.map(async (sts) => {
    // Fetch user details for each manager in the STS
    const populatedManagers = await Promise.all(sts.managers.map(async (managerId) => {
      const manager = await User.findById(managerId)
        .select('fullName email'); // Assuming user model contains fullName and email

      return {
        ward_number: sts.ward_number,
        ...manager.toObject() // Merge user details with ward_number
      };
    }));

    return populatedManagers;
  }));

  return res.status(201).json(new ApiResponse(201, populatedStsList.flat(), "Sts Managers list retrieved successfully"));
});


const getLandfillManagerList = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    throw new ApiError(401, "You are not allowed");
  }

  const landfillList = await Landfill.find({ managers: { $exists: true, $not: { $size: 0 } } })
    .select('name managers'); // Select both name and manager fields

  const populatedLandfillList = await Promise.all(landfillList.map(async (landfill) => {
    // Fetch user details for each manager in the Landfill
    const populatedManagers = await Promise.all(landfill.managers.map(async (managerId) => {
      const manager = await User.findById({ _id:managerId })
        .select('fullName email'); // Assuming user model contains fullName and email

      return manager.toObject();
    }));

    return {
      name: landfill.name,
      managers: populatedManagers
    };
  }));

  return res.status(200).json(new ApiResponse(201, populatedLandfillList, "Landfill managers list retrieved successfully"));
});


const getUnassignedUser = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    throw new ApiError(401, "You are not allowed");
  }
   
  
  // Fetch users where the role field doesn't exist
  const users = await User.find({ role: "Unassigned"});

  // Extract required user details
  const userDetails = users.map(user => ({
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
  }));

  return res.status(201).json(new ApiResponse(201, userDetails, "Users without role retrieved successfully"));
});


const getAllRoles = asyncHandler(async (req, res) => {
  // Fetch all roles from the database
  const roles = await Role.find({});

  // Check if any roles were found
  if (!roles || roles.length === 0) {
    throw new ApiError(401, "No roles found");
  }

  // Send the roles in the API response
  return res.status(201).json(new ApiResponse(201, roles, "All Roles retrieved successfully"));
});



export {
  getUsers,
  getUserById,
  deleteUser,
  updateAccountDetails,
  addNewUser,
  updateUserRoles,
  getManagersList,
  getLandfillManagerList,
  getUnassignedUser,
  getAllUsers,
  getAllRoles
};
