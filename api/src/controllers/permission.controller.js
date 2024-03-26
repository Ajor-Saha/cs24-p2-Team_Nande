import { Permission } from "../models/permission.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addPermission = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    throw new ApiError(401, "You are not allowed to see all users");
  }

  const { name, description } = req.body;

  if (!name) {
    throw new ApiError(401, "Name field is required");
  }

  const existPermission = await Permission.findOne({ name });

  if (existPermission) {
    throw new ApiError(401, "Already exist that Permission");
  }

  const permission = await Permission.create({
    name,
    description,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, permission, "Role created successfully"));
});

const getPermissions = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    throw new ApiError(401, "You are not allowed to see all permissons");
  }

  const permissions = await Permission.find();

  return res
    .status(201)
    .json(
      new ApiResponse(201, permissions, "Permissions retreive successfully")
    );
});

const updatePermission = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    throw new ApiError(401, "You are not allowed to update permission");
  }

  const { permissionId } = req.params;
  const { name, description } = req.body;

  if (!name) {
    throw new ApiError(401, "Name field is required");
  }

  const permission = await Permission.findById({ _id: permissionId });

  if (!permission) {
    throw new ApiError(404, "Role not found");
  }

  permission.name = name;
  permission.description = description;

  const updatedPermission = await permission.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedPermission, "Permission updated successfully")
    );
});

const getPermissionById = asyncHandler(async (req, res) => {
  const { permissionId } = req.params;

  const permission = await Permission.findById({ _id:permissionId });

  if (!permission) {
    throw new ApiError(404, 'Permission not found');
  }

  return res.status(200).json(new ApiResponse(200, permission, 'Permission found'));
});



const deletePermission = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    throw new ApiError(401, "You are not authorized");
  }

  const { permissionId } = req.params;

  const permission = await Permission.findById({ _id: permissionId });

  if (!permission) {
    throw new ApiError(404, "Permission not found");
  }

  const deletedPermission = await Permission.findByIdAndDelete({
    _id: permissionId,
  });

  if (!deletedPermission) {
    throw new ApiError(500, "Permission not deleted");
  }

  return res.status(200).json(new ApiResponse(200, {}, "Permission deleted"));
});

export {
     addPermission,
     getPermissions,
     updatePermission,
     deletePermission,
     getPermissionById
};
