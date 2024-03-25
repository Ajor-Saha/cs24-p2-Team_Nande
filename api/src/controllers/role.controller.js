import { Role } from "../models/role.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addRole = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    throw new ApiError(401, "You are not allowed to see all users");
  }

  const { name, description } = req.body;

  if (!name) {
    throw new ApiError(401, "Name field is required");
  }

  const existRole = await Role.findOne({ name });

  if (existRole) {
    throw new ApiError(401, "Already exist that role");
  }

  const role = await Role.create({
    name,
    description,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, role, "Role created successfully"));
});

const getRoles = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    throw new ApiError(401, "You are not allowed to see all users");
  }

  const roles = await Role.find();

  return res
    .status(201)
    .json(new ApiResponse(201, roles, "Role retreive successfully"));
});

const updateRole = asyncHandler(async (req, res) => {
    if (!req.user.isAdmin) {
      throw new ApiError(401, "You are not allowed to update roles");
    }
  
    const { roleId } = req.params;
    const { name, description } = req.body;
  
    if (!name) {
      throw new ApiError(401, "Name field is required");
    }
  
    const role = await Role.findById({ _id:roleId });
  
    if (!role) {
      throw new ApiError(404, "Role not found");
    }
  
    role.name = name;
    role.description = description;
  
    const updatedRole = await role.save();
  
    return res
      .status(200)
      .json(new ApiResponse(200, updatedRole, "Role updated successfully"));
});

const deleteRole = asyncHandler(async (req, res) => {
    if (!req.user.isAdmin) {
      throw new ApiError(401, "You are not authorized");
    }
  
    const { roleId } = req.params;
  
    const role = await Role.findById({ _id:roleId });
  
    if (!role) {
      throw new ApiError(404, "Role not found");
    }
  
    const deletedRole = await Role.findByIdAndDelete({ _id:roleId });
  
    if (!deletedRole) {
      throw new ApiError(500, "Role not deleted");
    }
  
    return res.status(200).json(new ApiResponse(200, {}, "Role deleted"));
  });
  

export { 
    addRole,
    getRoles,
    updateRole,
    deleteRole
};
