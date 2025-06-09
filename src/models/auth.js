import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const AuthSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    password: {
      type: String,
      // required: true,
      minlength: 8,
      select: false,
    },
    role: {
      type: String,
      required: true,
      enum: ["recruiter", "candidate"],
      index: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
      index: true,
    },
    verificationOTP: String,
    verificationOTPExpires: Date,
    resetPasswordOTP: String,
    resetPasswordOTPExpires: Date,
    lastLogin: Date,
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      // required: true,
      index: true,
    },
    otpAttempts: {
      type: Number,
      default: 0,
      select: false,
    },
    lastOTPSentAt: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

AuthSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

AuthSchema.methods.generateVerificationOTP = function () {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.verificationOTP = otp;
  this.verificationOTPExpires = Date.now() + 10 * 60 * 1000;
  this.lastOTPSentAt = Date.now();
  return otp;
};

AuthSchema.methods.generatePasswordResetOTP = function () {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.resetPasswordOTP = otp;
  this.resetPasswordOTPExpires = Date.now() + 10 * 60 * 1000;
  this.lastOTPSentAt = Date.now();
  return otp;
};

AuthSchema.methods.verifyOTP = function (enteredOTP) {
  if (this.otpAttempts >= 5) throw new Error("Too many OTP attempts");
  const isMatch = this.verificationOTP === enteredOTP;
  if (!isMatch) {
    this.otpAttempts += 1;
    this.save();
    return false;
  }
  if (this.verificationOTPExpires < Date.now()) return false;
  return true;
};

AuthSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Auth = mongoose.models.Auth || mongoose.model("Auth", AuthSchema);
export default Auth;
