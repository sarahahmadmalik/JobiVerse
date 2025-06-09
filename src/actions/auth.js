"use server";

import Auth from "@/models/auth";
import Candidate from "@/models/candidate";
import Recruiter from "@/models/recruiter";
import connectDB from "@/utils/db";
import { hash } from "bcryptjs";
import crypto from "crypto";
import { sendEmail } from "@/actions/email";

export async function generateOTP() {
  return crypto.randomInt(100000, 999999).toString();
}

export async function checkEmailExists(email) {
  await connectDB();
  const user = await Auth.findOne({ email });
  return !!user;
}

export async function initiateRegistration(email, name, role) {
  try {
    await connectDB();

    if (await checkEmailExists(email)) {
      return { error: "Email already registered" };
    }

    const otp = await generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    const authUser = await Auth.create([
      {
        email,
        name,
        role,
        verificationOTP: otp,
        verificationOTPExpires: otpExpires,
        isVerified: false,
      },
    ]);

    let profile;

    if (role === "candidate") {
      profile = await Candidate.create([
        {
          authId: authUser[0]._id,
          firstName: name.split(" ")[0] || "",
          lastName: name.split(" ")[1] || "",
          isOnboarded: false,
        },
      ]);
    } else {
      profile = await Recruiter.create([
        {
          authId: authUser[0]._id,
          company: {
            name: `${name}`,
            description: "",
            isOnboarded: false,
          },
        },
      ]);
    }

    await Auth.findByIdAndUpdate(authUser[0]._id, {
      profileId: profile[0]._id,
    });

    await sendEmail({
      to: email,
      subject: "Verify your JobiVerse account",
      text: `Your verification code for jobiverse is: ${otp}`,
    });

    return {
      success: true,
      userId: authUser[0]._id.toString(),
      profileId: profile[0]._id.toString(),
    };
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "Registration failed. Please try again." };
  }
}

export async function verifyOTP(email, otp) {
  await connectDB();

  const user = await Auth.findOne({
    email,
    verificationOTP: otp,
    verificationOTPExpires: { $gt: new Date() },
  });

  if (!user) {
    return { error: "Invalid or expired OTP" };
  }

  user.isVerified = true;
  user.verificationOTP = undefined;
  user.verificationOTPExpires = undefined;
  await user.save();

  return { success: true };
}

export async function completeRegistration(email, password) {
  await connectDB();

  const authUser = await Auth.findOne({ email, isVerified: true });
  if (!authUser) {
    return { error: "User not verified" };
  }

  authUser.password = await hash(password, 12);
  await authUser.save();

  return {
    success: true,
    role: authUser.role,
    userId: authUser._id.toString(),
  };
}
