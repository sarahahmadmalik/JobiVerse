import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const applicationService = {
  /**
   * Apply for a job with a resume
   * @param {string} jobId - Job ID to apply for
   * @param {string} candidateId - Candidate ID applying for the job
   * @param {string} resumeId - ID of the resume being submitted
   * @returns {Promise<object>} Created application data
   */
  applyForJob: async (jobId, candidateId, resumeId) => {
    try {
      const response = await axios.post(`${API_URL}/applications`, {
        jobId,
        candidateId,
        documents: {
          resume: resumeId
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error applying for job:', error);
      throw error;
    }
  },

  /**
   * Get all applications for a candidate
   * @param {string} candidateId - Candidate ID
   * @returns {Promise<Array>} List of applications
   */
  getCandidateApplications: async (candidateId) => {
    try {
      const response = await axios.get(`${API_URL}/applications?candidateId=${candidateId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching candidate applications:', error);
      throw error;
    }
  },

  /**
   * Get all applications for a job
   * @param {string} jobId - Job ID
   * @returns {Promise<Array>} List of applications
   */
  getJobApplications: async (jobId) => {
    try {
      const response = await axios.get(`${API_URL}/applications?jobId=${jobId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching job applications:', error);
      throw error;
    }
  },

  /**
   * Get a specific application by ID
   * @param {string} applicationId - Application ID
   * @returns {Promise<object>} Application data
   */
  getApplicationById: async (applicationId) => {
    try {
      const response = await axios.get(`${API_URL}/applications/${applicationId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching application:', error);
      throw error;
    }
  },

  /**
   * Update application status
   * @param {string} applicationId - Application ID
   * @param {string} status - New status
   * @returns {Promise<object>} Updated application data
   */
  updateApplicationStatus: async (applicationId, status) => {
    try {
      const response = await axios.patch(`${API_URL}/applications/${applicationId}/status`, {
        status
      });
      return response.data;
    } catch (error) {
      console.error('Error updating application status:', error);
      throw error;
    }
  }
};