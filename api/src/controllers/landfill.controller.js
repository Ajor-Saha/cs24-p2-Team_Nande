import { Landfill } from "../models/landFill.model.js";
import { User } from "../models/user.model.js";
import { Role } from "../models/role.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Vehicle } from "../models/vehicle.model.js";
import { LandfillEntry } from "../models/landfillEntry.model.js";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

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
    .json(
      new ApiResponse(200, landFill, "Landfill details retrieve successfully")
    );
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
    const landfillManagerRole = await Role.findOne({
      name: "LandFill Manager",
    });

    if (!landfillManagerRole) {
      throw new ApiError(401, "Landfill manager role not found");
    }

    const landfillManagerRoleId = landfillManagerRole._id;
    const landfillManagerUsers = usersWithRoles.filter((user) =>
      user.role.equals(landfillManagerRoleId)
    );

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

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          landfillManagersWithNoMatchingLandfill,
          "Available LandFill managers retreive successfully"
        )
      );
  } catch (error) {
    console.error("Error in getting available STS Managers:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get available STS Managers",
      error: error.message,
    });
  }
});

const assignManagerToLandfill = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    throw new ApiError(401, "You are not authorized");
  }

  const { landfillId, userId } = req.params;

  const landfill = await Landfill.findById({ _id: landfillId });

  if (!landfill) {
    throw new ApiError(404, "Landfill not found");
  }

  // Check if user exists
  const user = await User.findById({ _id: userId }).populate("role");

  if (!user || user.role.name !== "LandFill Manager") {
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
    .json(
      new ApiResponse(200, landfill, "Manager assigned to this lanfill successfully")
    );
});

const deleteManagerlandfill = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    throw new ApiError(401, "You are not authorized");
  }

  const { landfillId, userId } = req.params;

  // Check if STS exists
  const landfill = await Landfill.findById({ _id: landfillId });

  if (!landfill) {
    throw new ApiError(404, "LandFill not found");
  }

  const user = await User.findById({ _id: userId });

  if (!user) {
    throw new ApiError(401, "User not found");
  }
  // Check if the user is a manager for this STS
  if (!landfill.manager.includes(userId)) {
    throw new ApiError(404, "User is not a manager for this Landfill");
  }

  // Remove the user from the managers list of the STS
  landfill.manager = landfill.manager.filter(
    (managerId) => managerId.toString() !== userId
  );
  await landfill.save();

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        landfill,
        "Manager removed from this  Landfill successfully"
      )
    );
});

const findUserLandfill = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  // Find STS where the user is a manager
  const landfill = await Landfill.findOne({
    manager: { $in: [userId] },
  }).populate("manager");

  if (!landfill) {
    throw new ApiError(401, "User is not associated with any landfill");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, landfill, "user Landfill details retrieve successfully"));
});

const addLandFillEntry = asyncHandler(async (req, res) => {
  const { landfill_name } = req.params;
  const {
    vehicle_reg_number,
    weight_of_waste,
    time_of_arrival,
    time_of_departure,
    distance_traveled,
  } = req.body;

  // Check if the provided sts_id exists
  const LandfillExists = await Landfill.findOne({ name: landfill_name });
  if (!LandfillExists) {
    throw new ApiError(401, "Land not found");
  }

  const vehicleExist = await Vehicle.findOne({ vehicle_reg_number });

  if (!vehicleExist) {
    throw new ApiError(401, "Vehicle not found");
  }

  const newLandfillEntry = new LandfillEntry({
    vehicle_reg_number,
    weight_of_waste,
    time_of_arrival,
    time_of_departure,
    distance_traveled,
  });

  // Save the new stsEntry
  await newLandfillEntry.save();

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        newLandfillEntry,
        "Landfill Entry added successfully"
      )
    );
});

const findLandfillEntries = asyncHandler(async (req, res) => {
  try {
    const LandfillEntries = await LandfillEntry.find({});

    if (!LandfillEntries || LandfillEntries.length === 0) {
      throw new ApiError(401, "No LandfillEntry found for this Landfill");
    }

    res
      .status(201)
      .json(
        new ApiResponse(
          201,
          LandfillEntries,
          "Landfill entries retrieve successfully"
        )
      );
  } catch (error) {
    console.error("Error finding LandfillEntries:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const calculateFuelCostAndGeneratePDF = asyncHandler(async (req, res) => {
  try {
    const { landEntry_id } = req.params;
    const landfillEntry = await LandfillEntry.findOne({ _id: landEntry_id });

    if (!landfillEntry) {
      throw new ApiError(401, "LandfilEntry not found");
    }

    const vehicle_reg_number = landfillEntry.vehicle_reg_number;
    const vehicle = await Vehicle.findOne({ vehicle_reg_number });

    if (!vehicle) {
      throw new ApiError(401, "Vehicle not found");
    }

    // Extract required fields from the vehicle
    const { capacity, fuel_cost_loaded, fuel_cost_unloaded } = vehicle;

    // Extract required fields from the landfill entry
    const { weight_of_waste, distance_traveled, createdAt } = landfillEntry;

    // Calculate fuel cost based on the formula
    const fuelCost =
      fuel_cost_unloaded +
      (weight_of_waste / capacity) * (fuel_cost_loaded - fuel_cost_unloaded);

    // Create an array to store information
    const data = [
      { key: "Timestamps: ", value: createdAt },
      { key: "Weight of Waste: ", value: weight_of_waste },
      { key: "Distance Traveled: ", value: distance_traveled },
      {
        key: "Vehicle Details:",
        value: `Vehicle Reg. Number: ${vehicle_reg_number}, Capacity: ${capacity}, Fuel Cost (loaded): ${fuel_cost_loaded}, Fuel Cost (unloaded): ${fuel_cost_unloaded}`,
      },
      { key: "Total Fuel Cost:  ", value: fuelCost * distance_traveled },
    ];

    // Generate PDF
    const pdfName = generatePDF(data);

    // Send the PDF as response
    const absolutePath = path.resolve(pdfName); // Get absolute path
    res.sendFile(absolutePath);
  } catch (error) {
    console.error("Error calculating fuel cost and generating PDF:", error);
    return res
      .status(500)
      .json({ error: "Failed to calculate fuel cost and generate PDF" });
  }
});

const generatePDF = (data) => {
  const pdfName = "fuel_cost_report.pdf";
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(pdfName));

  // Add content to the PDF document
  doc.fontSize(16).text("Fuel Cost Report", { align: "center" }).moveDown();

  data.forEach(({ key, value }) => {
    doc.fontSize(12).text(`${key}: ${value}`).moveDown();
  });

  // Finalize the PDF document
  doc.end();

  return pdfName;
};

const getTotalWasteCollected = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    throw new ApiError(401, "You are not authorized");
  }

  const allEntries = await LandfillEntry.find({});

  // Calculate the total waste collected by summing the weight_of_waste field of all entries
  const totalWasteCollected = allEntries.reduce(
    (acc, entry) => acc + entry.weight_of_waste,
    0
  );

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        totalWasteCollected,
        "Total wasted collected by landfill"
      )
    );
});

const calculateFuelCosts = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    throw new ApiError(401, "You are not authorized");
  }

  try {
    const landfillEntries = await LandfillEntry.find({}, 'vehicle_reg_number weight_of_waste distance_traveled');

    const fuelCosts = [];

    for (const landfillEntry of landfillEntries) {
      try {
        // Fetch vehicle details using vehicle_reg_number
        const vehicle = await Vehicle.findOne({ vehicle_reg_number: landfillEntry.vehicle_reg_number });

        if (!vehicle) {
          // Skip to the next iteration if the vehicle is not found
          continue;
        }

        // Calculate fuel cost based on the formula
        const { capacity, fuel_cost_loaded, fuel_cost_unloaded } = vehicle;
        const weight_of_waste = landfillEntry.weight_of_waste;
        const distance_traveled = landfillEntry.distance_traveled;

        const fuelCost = (fuel_cost_unloaded + (weight_of_waste / capacity) * (fuel_cost_loaded - fuel_cost_unloaded)) * distance_traveled;

        // Create an object with vehicle_reg_number, fuel_cost, and weight_of_waste
        const fuelCostDetail = {
          vehicle_reg_number: landfillEntry.vehicle_reg_number,
          fuel_cost: fuelCost,
          weight_of_waste: weight_of_waste
        };

        // Push the result to the array
        fuelCosts.push(fuelCostDetail);
      } catch (error) {
        console.error(`Error processing vehicle ${landfillEntry.vehicle_reg_number}:`, error);
        // Log the error and continue to the next iteration
        continue;
      }
    }

    // Send the array as a response
    return res.status(201).json(
      new ApiResponse(
        201,
        fuelCosts,
        "Fuel cost data retrieve successfully"
      )
    );
  } catch (error) {
    console.error('Error calculating fuel costs:', error);
    res.status(500).json({ success: false, message: 'Failed to calculate fuel costs' });
  }
});



export {
  addLandFill,
  getAllLandfill,
  getlandFillByName,
  deleteLandfill,
  getAvailableLandfillManager,
  assignManagerToLandfill,
  deleteManagerlandfill,
  findUserLandfill,
  addLandFillEntry,
  findLandfillEntries,
  calculateFuelCostAndGeneratePDF,
  getTotalWasteCollected,
  calculateFuelCosts
};
