import { OTP } from "../models/otp.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import nodemailer from "nodemailer";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, username, password } = req.body;
  //console.log("email: ", email);

  if ([email, fullName, username, password].some((field) => field?.trim() === "")) {
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

  // Generate OTP (for demo, just using a simple random number)
  const otp = Math.floor(1000 + Math.random() * 9000);

  // Save OTP to database
  await OTP.create({
    email,
    otp,
  });

  // Send OTP to user's email
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verification OTP",
    text: `Your OTP is: ${otp}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      throw new ApiError(401, "Failed to send OTP");
    }
    console.log("Email sent: " + info.response);
    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          {},
          `OTP sent to your ${email}. Verify your account.`
        )
      );
  });
});

const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const otpRecord = await OTP.findOne({ email }).sort({ createdAt: -1 });

  if (!otpRecord || otpRecord.otp !== otp) {
    throw new ApiError(401, "Invalid OTP");
  }

  await User.findOneAndUpdate({ email }, { isVerified: true });

  

  await OTP.deleteOne({ _id: otpRecord._id });

  return res
    .status(201)
    .json(new ApiResponse(201, {}, "Account validated successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  

  if (!email) {
    throw new ApiError(400, "username or email is required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user.isVerified) {
    throw new ApiError(401, "You are not verified")
  }

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged In Successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1, // this removes the field from document
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"));
});


const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});


const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current User fetched successfully"));
});

const updateProfileDetails = asyncHandler(async (req, res) => {
  const { fullName,username, email } = req.body;

  if (!fullName || !email || !username) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName: fullName,
        email: email,
        username: username
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Profile details updated successfully"));
});


const forgetPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email || email.trim() === "") {
    throw new ApiError(401, "Email is required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(401, "User not found");
  }

  // Generate new OTP
  const otp = Math.floor(1000 + Math.random() * 9000);

  // Update OTP in the database
  const findOtp = await OTP.findOne({ email });

  if (!findOtp) {
     await OTP.create({
      email,
      otp
     })
  } else {
    await OTP.findOneAndUpdate({ email }, { otp });
  }

  // Send OTP to user's email
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verification OTP",
    text: `Your new OTP is: ${otp}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      throw new ApiError(401, "Failed to send OTP");
    }
    console.log("Email sent: " + info.response);
    return res.status(201).json(new ApiResponse(201, {}, `New OTP sent to your ${email}`));
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { email, newPassword } = req.body;

  // Find the user by email
  const user = await User.findOne({ email });

  // If user not found, return error
  if (!user) {
      throw new ApiError(400, "User not found");
  }

  // Update user's password
  user.password = newPassword;
  
  // Save the updated user (validateBeforeSave set to false to bypass validation)
  await user.save({ validateBeforeSave: false });

  // Return success response
  return res.status(200).json(new ApiResponse(200, {}, "Password reset successfully"));
});

const confirmOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const otpRecord = await OTP.findOne({ email }).sort({ createdAt: -1 });

  if (!otpRecord || otpRecord.otp !== otp) {
    throw new ApiError(401, "Invalid OTP");
  }


  await OTP.deleteOne({ _id: otpRecord._id });

  return res
    .status(201)
    .json(new ApiResponse(201, {}, "OTP verification Successfull"));
});



export {
   generateAccessAndRefreshTokens,
   registerUser,
   loginUser,
   logoutUser,
   changeCurrentPassword,
   getCurrentUser,
   updateProfileDetails,
   verifyOTP,
   forgetPassword,
   resetPassword,
   confirmOTP
};
