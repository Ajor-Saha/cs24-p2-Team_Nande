import { Permission } from "../models/permission.model.js";
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

const getRoleById = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    throw new ApiError(401, "You are not allowed")
  }

  const { roleId } = req.params;

  const role = await Role.findById({ _id:roleId });

  if (!role) {
    throw new ApiError(401, "Role not found")
  }

  return res
     .status(201)
     .json(new ApiResponse(201, role, "Role retreive successfully"))
})

const updateRole = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    throw new ApiError(401, "You are not allowed to update roles");
  }

  const { roleId } = req.params;
  const { name, description } = req.body;

  if (!name) {
    throw new ApiError(401, "Name field is required");
  }

  const role = await Role.findById({ _id: roleId });

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

  const role = await Role.findById({ _id: roleId });

  if (!role) {
    throw new ApiError(404, "Role not found");
  }

  const deletedRole = await Role.findByIdAndDelete({ _id: roleId });

  if (!deletedRole) {
    throw new ApiError(500, "Role not deleted");
  }

  return res.status(200).json(new ApiResponse(200, {}, "Role deleted"));
});

const assignPermissionsToRole = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    throw new ApiError(401, "You are not authorized");
  }
  const { roleId } = req.params;
  const role = await Role.findById({ _id:roleId })
  const { permission } = req.body;

  const existingPermission = await Permission.findOne({ name:permission });
  if (!existingPermission) {
    throw new ApiError(400, "Permission does not exist");
  }

  const permissionExistsInRole = role.permissions.some(p => p.equals(existingPermission._id));
  
  if (permissionExistsInRole) {
    throw new ApiError(401, "Permission already added")
  }
  //console.log(permissionExistsInRole);
  if (!permissionExistsInRole) {
    // Add the permission to the role's permissions array
    role.permissions.push(existingPermission._id);
    await role.save();
  }

  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        role,
        "Permission add to this role successfully"
      )
    );
  

  
});


const getPermissionsForRole = asyncHandler(async (req, res) => {
  const { roleId } = req.params;

  // Check if the role exists
  const role = await Role.findById({ _id:roleId }).populate('permissions');

  if (!role) {
    throw new ApiError(404, "Role not found");
  }

  // Extract the permissions from the role
  const permissions = role.permissions.map(permission => ({
    _id: permission._id,
    name: permission.name,
    description: permission.description
  }));

  return res.status(200).json(new ApiResponse(200, permissions, "Permissions for role retrieved successfully"));
});

const deletePermissionForRole = asyncHandler(async (req, res) => {
  const { roleId } = req.params;
  const { permission } = req.body;

  // Check if the role exists
  const role = await Role.findById(roleId);

  if (!role) {
    throw new ApiError(404, "Role not found");
  }

  // Check if the permission exists
  const existPermission = await Permission.findOne({ name:permission });

  if (!permission) {
    throw new ApiError(404, "Permission not found");
  }

  // Find the index of the permission in the role's permissions array
  const index = role.permissions.findIndex(p => p.equals(existPermission._id));

  if (index === -1) {
    throw new ApiError(404, "Permission not assigned to this role");
  }

  // Remove the permission from the role's permissions array
  role.permissions.splice(index, 1);
  await role.save();

  return res.status(200).json(new ApiResponse(200, {}, "Permission removed from role successfully"));
});



export { addRole, getRoles, updateRole, deleteRole, assignPermissionsToRole,
getPermissionsForRole, getRoleById, deletePermissionForRole };
