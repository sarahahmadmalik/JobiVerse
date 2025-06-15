const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const generateResume = async (userData, jobData) => {
  const response = await fetch(`${API_URL}/generate-resume-content`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userData, jobData }),
  });
  return await response.json();
};

export const resumeService = {
  /**
   * Save resume to database
   * @param {string} userId - User ID
   * @param {object} resumeData - Resume content and metadata
   * @returns {Promise<object>} Saved resume data
   */
  saveResume: async (userId, resumeData) => {
    const response = await fetch(`${API_URL}/resume`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        ...resumeData
      }),
    });
    return await response.json();
  },

  /**
   * Get all resumes for a user
   * @param {string} userId - User ID
   * @returns {Promise<Array>} List of user's resumes
   */
  getUserResumes: async (userId) => {
    const response = await fetch(`${API_URL}/resume?userId=${userId}`);
    console.log(response)
    return await response.json();
  },

  /**
   * Get a specific resume by ID
   * @param {string} resumeId - Resume ID
   * @returns {Promise<object>} Resume data
   */
  getResumeById: async (resumeId) => {
    console.log(resumeId)
    const response = await fetch(`${API_URL}/resume/${resumeId}`);
    return await response.json();
  },

  /**
   * Update a resume
   * @param {string} resumeId - Resume ID
   * @param {object} updates - Fields to update
   * @returns {Promise<object>} Updated resume data
   */
  updateResume: async (resumeId, updates) => {
    const response = await fetch(`${API_URL}/resume/${resumeId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    return await response.json();
  },

  /**
   * Delete a resume
   * @param {string} resumeId - Resume ID
   * @returns {Promise<object>} Deletion confirmation
   */
  deleteResume: async (resumeId) => {
    const response = await fetch(`${API_URL}/resumes/${resumeId}`, {
      method: 'DELETE',
    });
    return await response.json();
  }
};