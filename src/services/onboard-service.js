import Candidate from '@/models/candidate'
import Recruiter from '@/models/recruiter'
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

export const recruiterService = {
  saveFirstStep: async (authId, data) => {
    await connectDB();
    try {
      const { companyName, industry, companySize, location, website } = data;

      // Validate required fields
      if (!companyName || !industry || !companySize || !location) {
        throw new Error('Missing required fields');
      }

      // Create or update recruiter with proper schema structure
      const recruiter = await Recruiter.findOneAndUpdate(
        { authId },
        {
          $set: {
            'company.name': companyName.trim(),
            'company.industry': industry.trim(),
            'company.size': companySize.trim(),
            'company.location': location.trim(),
            ...(website && { 'company.website': website.trim() }), // Only set if website exists
            isOnboarded: false
          }
        },
        { 
          upsert: true,
          new: true,
          runValidators: true // Ensure schema validations are run
        }
      );

      return recruiter;
    } catch (error) {
      console.error('Error saving recruiter first step:', error);
      throw new Error(error.message || 'Failed to save company details');
    }
  },

  saveOnboardingStep: async (authId, step, stepData) => {
    await connectDB();
    try {
      let update = {};
      
      // Handle different steps with proper schema structure
      switch(step) {
        case 2: // Company Details
          update = {
            $set: {
              'company.description': stepData.description?.trim() || '',
              'company.specialties': stepData.specialties || [],
              'company.foundedYear': stepData.foundedYear || null,
              'company.website': stepData.website?.trim() || ''
            }
          };
          break;
        
        case 3:
          update = {
            $set: {
              'company.description': stepData.companyDescription?.trim() || '',
              'company.socialLinks': {
                facebook: stepData.socialLinks?.facebook?.trim() || '',
                twitter: stepData.socialLinks?.twitter?.trim() || '',
                instagram: stepData.socialLinks?.instagram?.trim() || '',
                linkedin: stepData.socialLinks?.linkedin?.trim() || ''
              },
              'company.logo': stepData.logoUrl
            }
          };
          break;
       
        
        default:
          throw new Error('Invalid step number');
      }

      const recruiter = await Recruiter.findOneAndUpdate(
        { authId },
        update,
        { 
          new: true,
          runValidators: true // Ensure schema validations are run
        }
      );

      return recruiter;
    } catch (error) {
      console.error(`Error saving recruiter step ${step}:`, error);
      throw new Error(error.message || `Failed to save step ${step} data`);
    }
  },

  completeOnboarding: async (authId) => {
    await connectDB();
    try {
      const recruiter = await Recruiter.findOneAndUpdate(
        { authId },
        { $set: { isOnboarded: true } },
        { new: true }
      );
      
      return recruiter;
    } catch (error) {
      console.error('Error completing recruiter onboarding:', error);
      throw new Error(error.message || 'Failed to complete onboarding');
    }
  },

  getOnboardingProgress: async (authId) => {
    await connectDB();
    try {
      const recruiter = await Recruiter.findOne({ authId })
        .select('-__v -createdAt -updatedAt') // Exclude unnecessary fields
        .lean();
      
      if (!recruiter) {
        throw new Error('Recruiter not found');
      }
      
      return recruiter;
    } catch (error) {
      console.error('Error fetching recruiter onboarding progress:', error);
      throw new Error(error.message || 'Failed to fetch onboarding progress');
    }
  },

  updateCompanyProfile: async (authId, updateData) => {
    await connectDB();
    try {
      // Prepare company data with proper trimming
      const companyUpdates = {};
      Object.keys(updateData).forEach(key => {
        if (typeof updateData[key] === 'string') {
          companyUpdates[`company.${key}`] = updateData[key].trim();
        } else {
          companyUpdates[`company.${key}`] = updateData[key];
        }
      });

      const recruiter = await Recruiter.findOneAndUpdate(
        { authId },
        { $set: companyUpdates },
        { 
          new: true,
          runValidators: true
        }
      );
      
      return recruiter;
    } catch (error) {
      console.error('Error updating company profile:', error);
      throw new Error(error.message || 'Failed to update company profile');
    }
  },

  getCompanyProfile: async (authId) => {
    await connectDB();
    try {
      const recruiter = await Recruiter.findOne({ authId })
        .select('company isOnboarded')
        .lean();
      
      if (!recruiter) {
        throw new Error('Recruiter not found');
      }
      
      return recruiter;
    } catch (error) {
      console.error('Error fetching company profile:', error);
      throw new Error(error.message || 'Failed to fetch company profile');
    }
  },

  // Additional utility methods
  validateSocialLink: (platform, url) => {
    const patterns = {
      facebook: /^(https?:\/\/)?(www\.)?facebook\.com\/.+/i,
      twitter: /^(https?:\/\/)?(www\.)?twitter\.com\/.+/i,
      instagram: /^(https?:\/\/)?(www\.)?instagram\.com\/.+/i,
      linkedin: /^(https?:\/\/)?(www\.)?linkedin\.com\/.+/i
    };
    
    return patterns[platform].test(url);
  }
};
