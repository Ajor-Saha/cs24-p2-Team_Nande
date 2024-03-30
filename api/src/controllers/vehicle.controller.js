import { STS } from "../models/sts.model.js";
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
    fuel_cost_loaded,
    fuel_cost_unloaded,
  } = req.body;

  if (
    ![vehicle_reg_number, type, fuel_cost_loaded, fuel_cost_unloaded].every(
      (field) => field !== undefined
    )
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

  let capacity;
  switch (type) {
    case "Open Truck":
      capacity = 3;
      break;
    case "Dump Truck":
      capacity = 5;
      break;
    case "Compactor":
      capacity = 7;
      break;
    case "Container Carrier":
      capacity = 15;
      break;
    default:
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
  const { vehicle_reg_number } = req.params;

  // Check if the vehicle exists
  const vehicle = await Vehicle.findOne({ vehicle_reg_number });
  if (!vehicle) {
    throw new ApiError(404, "Vehicle not found");
  }

  // Check if the vehicle is associated with any STS
  const sts = await STS.findOne({ vehicles: { $in: [vehicle_reg_number] } });
  if (sts) {
    // If the vehicle is associated with an STS, remove it from the STS
    await STS.findOneAndUpdate(
      { _id: sts._id },
      { $pull: { vehicles: vehicle_reg_number } }
    );
  }

  // Delete the vehicle
  await Vehicle.findOneAndDelete({ vehicle_reg_number });

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

const checkVehicleAssignment = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    throw new ApiError(401, "You are not authorized");
  }

  const { vehicle_reg_number } = req.params;
  const vehicle = await Vehicle.findOne({ vehicle_reg_number });
  if (!vehicle) {
    throw new ApiError(401, "Vehicle not found");
  }

  const sts = await STS.findOne({ vehicles: { $in: [vehicle_reg_number] } });
  if (!sts) {
    return res
      .status(201)
      .json(new ApiResponse(201, vehicle, "Vehicle not assigned to any STS"));
  }

  return res
    .status(201)
    .json(new ApiResponse(201, sts.ward_number, "Vehicle assigned to STS"));
});

const assignVehicleToSTS = async (req, res) => {
  const { ward_number } = req.body;
  const { vehicle_reg_number } = req.params;

  // Find the STS document by ward_number
  const sts = await STS.findOne({ ward_number });

  // Check if the STS document exists
  if (!sts) {
    throw new ApiError(401, "STS not found")
  }

  const vehicle = await Vehicle.findOne({ vehicle_reg_number });

  if (!vehicle) {
    throw new ApiError(401,"Vehicle not found")
  }

  // Check if the vehicle is already assigned to the STS
  if (sts.vehicles.includes(vehicle_reg_number)) {
    return res.status(201).json(new ApiResponse(201,{}, "Vehicle already assigned to this STS"));
  }

  // Check if the vehicle exists
  

  // Assign the vehicle to the STS
  sts.vehicles.push(vehicle_reg_number);
  await sts.save();

  return res
    .status(201)
    .json(new ApiResponse(201, sts, "Vehicle assigned to STS successfully"));
};

export {
  addVehicle,
  getVehicleByRegNumber,
  getAllVehicle,
  deleteVehicle,
  updateVehicle,
  checkVehicleAssignment,
  assignVehicleToSTS
};
