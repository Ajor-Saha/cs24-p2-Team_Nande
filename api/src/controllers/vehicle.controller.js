import { Vehicle } from "../models/vehicle.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addVehicle = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    throw new ApiError(401, "You are not authorized");
  }

  const {
    vehicle_reg_number,
    type,
    capacity,
    fuel_cost_loaded,
    fuel_cost_unloaded,
  } = req.body;

  if (
    ![
      vehicle_reg_number,
      type,
      capacity,
      fuel_cost_loaded,
      fuel_cost_unloaded,
    ].every((field) => field !== undefined)
  ) {
    throw new ApiError(401, "All fields are required");
  }

  const allowedTypes = [
    "Open Truck",
    "Dump Truck",
    "Compactor",
    "Container Carrier",
  ];
  if (!allowedTypes.includes(type)) {
    throw new ApiError(400, "Invalid vehicle type");
  }

  const existingVehicle = await Vehicle.findOne({ vehicle_reg_number });

  if (existingVehicle) {
    throw new ApiError(
      401,
      "Vehicle with the same registration number already exists"
    );
  }

  const newVehicle = await Vehicle.create({
    vehicle_reg_number,
    type,
    capacity,
    fuel_cost_loaded,
    fuel_cost_unloaded,
  });

  return res
    .status(201)
    .json(new ApiResponse(200, newVehicle, "Vehicle added successfully"));
});

const getVehicleByRegNumber = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    throw new ApiError(401, "You are not authorized");
  }

  const { vehicle_reg_number } = req.params;

  const vehicle = await Vehicle.findOne({ vehicle_reg_number });

  if (!vehicle) {
    throw new ApiError(
      401,
      "Vehicle with that  registration number not exists"
    );
  }

  return res
    .status(201)
    .json(
      new ApiResponse(200, vehicle, "Vehicle details retrieve successfully")
    );
});

const getAllVehicle = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    throw new ApiError(401, "You are not authorized");
  }

  const vehicles = await Vehicle.find();

  return res
    .status(201)
    .json(new ApiResponse(200, vehicles, "Vehicles retrieve successfully"));
});

const deleteVehicle = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    throw new ApiError(401, "You are not authorized");
  }

  const { vehicle_reg_number } = req.params;

  const vehicle = await Vehicle.findOneAndDelete({ vehicle_reg_number });

  if (!vehicle) {
    throw new ApiError(404, "Vehicle not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Vehicle deleted successfully"));
});

const updateVehicle = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    throw new ApiError(401, "You are not authorized");
  }

  const { vehicle_reg_number } = req.params;

  const vehicle = await Vehicle.findOne({ vehicle_reg_number });

  if (!vehicle) {
    throw new ApiError(404, "Vehicle not found");
  }

  const { type, capacity, fuel_cost_loaded, fuel_cost_unloaded } = req.body;

  const allowedTypes = [
    "Open Truck",
    "Dump Truck",
    "Compactor",
    "Container Carrier",
  ];

  // Check if any field is given to update
  const updateFields = {};
  if (type) {
    if (!allowedTypes.includes(type)) {
      throw new ApiError(400, "Invalid vehicle type");
    }
    updateFields.type = type;
  }
  if (capacity) {
    updateFields.capacity = capacity;
  }
  if (fuel_cost_loaded) {
    updateFields.fuel_cost_loaded = fuel_cost_loaded;
  }
  if (fuel_cost_unloaded) {
    updateFields.fuel_cost_unloaded = fuel_cost_unloaded;
  }

  

  const updatedVehicle = await Vehicle.findOneAndUpdate(
    { vehicle_reg_number },
    updateFields,
    { new: true }
  );

  if (!updatedVehicle) {
    throw new ApiError(404, "Vehicle not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedVehicle, "Vehicle updated successfully"));
});

export {
  addVehicle,
  getVehicleByRegNumber,
  getAllVehicle,
  deleteVehicle,
  updateVehicle,
};
