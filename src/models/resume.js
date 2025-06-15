import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auth',
    required: true
  },
  resumeLink: {
    type: String,
    required: true,
    trim: true
  },
  fileName: {
    type: String,
    required: true
  },
   content: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
    default: {}
  },
  fileType: {
    type: String,
    enum: ['pdf', 'doc', 'docx'],
    default: 'pdf'
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true }
});

resumeSchema.index({ candidateId: 1 });
resumeSchema.index({ isDefault: 1 });

const Resume = mongoose.models.Resume || mongoose.model('Resume', resumeSchema);
export default Resume;