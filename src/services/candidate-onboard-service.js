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

  saveOnboardingStep: async (authId, step, stepData) => {
    await connectDB()
    try {
      let update = {}
      // Handle different steps
      switch (step) {
        case 2:
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
        case 3:
          const experiences = Array.isArray(stepData) ? stepData : [stepData]
          const formattedExperiences = experiences.map(exp => ({
            jobTitle: exp.jobTitle?.trim() || '',
            companyName: exp.companyName?.trim(),
            location: exp.workLocation?.trim() || '',
            employmentType: exp.employmentType?.trim() || '',
            startDate: exp.startDate ? new Date(exp.startDate) : null,
            endDate: exp.endDate ? new Date(exp.endDate) : null,
            description: exp.description?.trim() || ''
          }))

          update = {
            $set: {
              experience: formattedExperiences
            }
          }
          break
        case 4: // Education
          const educationEntries = Array.isArray(stepData)
            ? stepData
            : [stepData]
          const formattedEducation = educationEntries.map(edu => ({
            degree: edu.degree?.trim() || '',
            fieldOfStudy: edu.fieldOfStudy?.trim() || '',
            institution: edu.institution?.trim() || '',
            location: edu.location?.trim() || '',
            startDate: edu.startDate ? new Date(edu.startDate) : null,
            endDate: edu.endDate ? new Date(edu.endDate) : null,
            description: edu.description?.trim() || ''
          }))

          update = {
            $set: {
              education: formattedEducation
            }
          }
          break
        case 5: // Social Links
          update = { $set: { socialLinks: stepData } }
          break
        case 6: // Job Preferences
          update = {
            $set: {
              'jobPreferences.desiredTitle': stepData.desiredTitle,
              'jobPreferences.preferredLocations': stepData.preferredLocations,
              'jobPreferences.industries': stepData.industries,
              'jobPreferences.salaryExpectation': stepData.salaryExpectation
                ? Number(stepData.salaryExpectation.replace(/[^0-9.-]+/g, ''))
                : null,
              'jobPreferences.employmentTypes': stepData.employmentTypes
            }
          }
          break
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
