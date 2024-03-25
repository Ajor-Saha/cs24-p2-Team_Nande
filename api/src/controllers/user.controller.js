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

export { getUsers, getUserById, deleteUser, updateAccountDetails };
