import Candidate from '@/models/candidate'
import connectDB from '@/utils/db'

export const candidateService = {
  saveFirstStep: async (authId, data) => {
    await connectDB()
    try {
      const { phone, desiredTitle, availability, location } = data

      // Create or update candidate
      const candidate = await Candidate.findOneAndUpdate(
        { authId },
        {
          $set: {
            phone,
            'jobPreferences.desiredTitle': desiredTitle,
            'jobPreferences.availability': availability,
            location,
            isOnboarded: false // Mark as onboarding in progress
          }
        },
        { upsert: true, new: true }
      )

      return candidate
    } catch (error) {
      console.error('Error saving candidate first step:', error)
      throw error
    }
  },

  // Save subsequent onboarding steps
  saveOnboardingStep: async (authId, step, stepData) => {
    await connectDB()
    try {
      let update = {}

      // Handle different steps
      switch (step) {
        case 2: // Experience
          const skillsArray = Array.isArray(stepData) ? stepData : [stepData]
          const cleanedSkills = skillsArray
            .map(skill =>
              typeof skill === 'string' ? skill.trim() : String(skill)
            )
            .filter(skill => skill.length > 0)

          update = {
            $addToSet: {
              skills: {
                $each: cleanedSkills
              }
            }
          }
          break
        case 3: // Skills
          update = { $addToSet: { skills: { $each: stepData } } }
          break
        case 4: // Education
          update = { $push: { education: stepData } }
          break
        case 5: // Social Links
          update = { $set: { socialLinks: stepData } }
          break
        // Add cases for other steps as needed
        default:
          throw new Error('Invalid step number')
      }

      const candidate = await Candidate.findOneAndUpdate({ authId }, update, {
        new: true
      })

      return candidate
    } catch (error) {
      console.error(`Error saving candidate step ${step}:`, error)
      throw error
    }
  },

  // Mark onboarding as complete
  completeOnboarding: async authId => {
    await connectDB()
    try {
      const candidate = await Candidate.findOneAndUpdate(
        { authId },
        { $set: { isOnboarded: true } },
        { new: true }
      )
      return candidate
    } catch (error) {
      console.error('Error completing onboarding:', error)
      throw error
    }
  },

  // Get candidate onboarding progress
  getOnboardingProgress: async authId => {
    await connectDB()
    try {
      const candidate = await Candidate.findOne({ authId })
      return candidate
    } catch (error) {
      console.error('Error fetching onboarding progress:', error)
      throw error
    }
  }
}
