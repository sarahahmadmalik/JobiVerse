import mongoose from "mongoose";

const InterviewSchema = new mongoose.Schema(
  {
    zoomMeetingId: { 
      type: String, 
      required: function() {
        return this.location === 'zoom'; // Only required if location is zoom
      } 
    },
    joinUrl: { 
      type: String, 
      required: function() {
        return this.location === 'zoom'; // Only required if location is zoom
      } 
    },
    startUrl: { 
      type: String, 
      required: function() {
        return this.location === 'zoom'; // Only required if location is zoom
      } 
    },
    jobId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "JobPost" 
    },
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true
    },
    candidateIds: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Candidate" 
    }],
    interviewers: [{ 
      name: { 
        type: String, 
        required: true 
      },
      email: { 
        type: String, 
        required: true 
      } 
    }],
    startTime: { 
      type: Date, 
      required: true 
    },
    duration: { 
      type: Number, 
      required: true 
    },
    status: { 
      type: String, 
      enum: ["scheduled", "completed", "canceled"], 
      default: "scheduled" 
    },
    location: {
      type: String,
      enum: ["zoom", "in-office", "onsite"],
      required: true
    },
    address: {
      type: String,
      required: function() {
        return this.location === 'in-office' || this.location === 'onsite';
      }
    },
    stage: {
      type: String,
      enum: ["Screening", "Technical", "HR", "Final"],
      default: "Technical"
    },
    notes: {
      type: String
    }
  }, 
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Add virtual population if needed
InterviewSchema.virtual("jobDetails", {
  ref: "JobPost",
  localField: "jobId",
  foreignField: "_id",
  justOne: true
});

InterviewSchema.virtual("candidates", {
  ref: "Candidate",
  localField: "candidateIds",
  foreignField: "_id"
});

InterviewSchema.virtual("interviewerDetails", {
  ref: "Auth",
  localField: "interviewers.userId",
  foreignField: "_id"
});

InterviewSchema.virtual("recruiterDetails", {
  ref: "Auth",
  localField: "recruiterId",
  foreignField: "_id",
  justOne: true
});

// Add methods if needed
InterviewSchema.methods.checkAvailability = function() {
  return this.status === "scheduled";
};

InterviewSchema.methods.reschedule = function(newStartTime, newDuration) {
  this.startTime = newStartTime;
  this.duration = newDuration;
  return this.save();
};

const Interview = mongoose.models.Interview || mongoose.model("Interview", InterviewSchema);
export default Interview;