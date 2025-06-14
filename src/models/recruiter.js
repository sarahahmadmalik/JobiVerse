import mongoose from 'mongoose'

const RecruiterSchema = new mongoose.Schema(
  {
    authId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Auth',
      required: true,
      unique: true
    },
    company: {
      name: {
        type: String,
        required: [true, 'Company name is required'],
        trim: true,
        maxlength: [100, 'Company name cannot exceed 100 characters']
      },
      industry: {
        type: String,
        // required: [true, "Industry is required"],
        trim: true
      },
      size: {
        type: String,
        // required: [true, "Company size is required"],
        trim: true
      },
      location: {
        type: String,
        // required: [true, "Location is required"],
        trim: true,
        maxlength: [100, 'Location cannot exceed 100 characters']
      },
       hqLocation: {
        type: String,
        trim: true,
        maxlength: [100, "HQ Location cannot exceed 100 characters"],
      },
      logo: {
        type: String,
        default: ''
      },
      description: {
        type: String,
        // required: [true, "Company description is required"],
        trim: true,
        maxlength: [2000, 'Description cannot exceed 2000 characters']
      },
      specialties: {
        type: [String]
        // required: [true, "At least one specialty is required"],
        // validate: {
        //   validator: (v) => Array.isArray(v) && v.length > 0,
        //   message: "Please add at least one specialty",
        // },
      },
      foundedYear: {
        type: Number,
        min: [1800, 'Founded year seems too early'],
        max: [new Date().getFullYear(), 'Founded year cannot be in the future']
      },
      website: {
        type: String,
        trim: true,
        match: [
          /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
          'Please enter a valid website URL'
        ]
      },
      socialLinks: {
        facebook: {
          type: String,
          trim: true,
          match: [
            /^(https?:\/\/)?(www\.)?facebook\.com\/.+/i,
            'Please enter a valid Facebook URL'
          ]
        },
        twitter: {
          type: String,
          trim: true,
          match: [
            /^(https?:\/\/)?(www\.)?twitter\.com\/.+/i,
            'Please enter a valid Twitter URL'
          ]
        },
        instagram: {
          type: String,
          trim: true,
          match: [
            /^(https?:\/\/)?(www\.)?instagram\.com\/.+/i,
            'Please enter a valid Instagram URL'
          ]
        },
        linkedin: {
          type: String,
          trim: true,
          match: [
            /^(https?:\/\/)?(www\.)?linkedin\.com\/.+/i,
            'Please enter a valid LinkedIn URL'
          ]
        }
      },
      contact: {
        hrEmail: {
          type: String,
          trim: true,
          match: [/.+@.+\..+/, 'Please enter a valid email']
        },
        generalEmail: {
          type: String,
          trim: true,
          match: [/.+@.+\..+/, 'Please enter a valid email']
        },
        address: {
          type: String,
          trim: true,
          maxlength: 200
        }
      }
    },
    isOnboarded: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
)

RecruiterSchema.pre('save', function (next) {
  const trimStrings = obj => {
    Object.keys(obj).forEach(key => {
      if (typeof obj[key] === 'string') {
        obj[key] = obj[key].trim()
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        trimStrings(obj[key])
      }
    })
  }

  trimStrings(this.company)
  next()
})

RecruiterSchema.post('save', async function (doc, next) {
  if (doc.onboardingCompleted) {
    try {
      await mongoose
        .model('Auth')
        .updateOne(
          { _id: doc.authId },
          { $set: { hasCompletedOnboarding: true } }
        )
    } catch (err) {
      console.error('Auth update error:', err)
    }
  }
  next()
})

RecruiterSchema.query.byIndustry = function (industry) {
  return this.where({ 'company.industry': new RegExp(industry, 'i') })
}

RecruiterSchema.query.withLogo = function () {
  return this.where('company.logo').ne('')
}

RecruiterSchema.methods.getPublicProfile = function () {
  const recruiter = this.toObject()

  delete recruiter.__v
  delete recruiter.createdAt
  delete recruiter.updatedAt

  return recruiter
}

RecruiterSchema.methods.hasSocialLinks = function () {
  return Object.values(this.company.socialLinks).some(
    link => link && link.trim() !== ''
  )
}

RecruiterSchema.index({ 'company.name': 'text' })
RecruiterSchema.index({ 'company.industry': 1 })
RecruiterSchema.index({ 'company.location': 1 })
RecruiterSchema.index({ 'company.specialties': 1 })
RecruiterSchema.index({ 'company.foundedYear': 1 })

const Recruiter =
  mongoose.models.Recruiter || mongoose.model('Recruiter', RecruiterSchema)

export default Recruiter
