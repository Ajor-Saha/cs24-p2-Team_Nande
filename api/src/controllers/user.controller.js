import { Role } from "../models/role.model.js";
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

const addNewUser = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    throw new ApiError(401, "You are not authorized");
  }

  const { fullName, email, username, password } = req.body;
  //console.log("email: ", email);

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }
  //console.log(req.files);

  const user = await User.create({
    fullName,
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User created Successfully"));
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

  const user = await User.findById({ _id: userId });

  if (!user) {
    throw new ApiError(401, "User not found");
  }

  const deletedUser = await User.findByIdAndDelete({ _id: userId });

  if (!deletedUser) {
    throw new ApiError(401, "User not deleted");
  }

  return res.status(201).json(new ApiResponse(200, {}, "User deleted"));
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
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"));
});

const updateUserRoles = asyncHandler(async (req, res) => {

  if (!req.user.isAdmin) {
    throw new ApiError(401, "You are not allowed")
  }
  const { userId } = req.params;
  const { role } = req.body;
  const user = await User.findById({ _id:userId });

  if (!user) {
    throw new ApiError(401, "User not found");
  }

  const requestedRole = await Role.findOne({ name: role });

  if (!requestedRole) {
    throw new ApiError(401, `Role ${role} not found`);
  }

  // Check if the requested role is 'Admin'
  const isAdminRole = requestedRole.name.toLowerCase() === "admin";

  // If the requested role is 'Admin', update isAdmin field to true
  if (isAdminRole) {
    user.isAdmin = true;
  } else {
    user.isAdmin = false;
  }

  // Update user's role
  user.role = requestedRole._id;

  
  await user.save();

  const updatedUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Account details updated successfully"));
});

export { getUsers, getUserById, deleteUser, updateAccountDetails, addNewUser, updateUserRoles };
