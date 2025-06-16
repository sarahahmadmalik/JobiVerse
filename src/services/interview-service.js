import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const interviewService = {
  /**
   * Get interviews where the user is an interviewer
   * @param {string} userId - User ID from session
   * @returns {Promise<Array>} List of interviews
   */
  getInterviewsAsInterviewer: async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/interviews?interviewerId=${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching interviews as interviewer:', error);
      throw error;
    }
  },

  /**
   * Get interviews where the user is a candidate
   * @param {string} candidateId - Candidate ID (from user session)
   * @returns {Promise<Array>} List of interviews
   */
  getInterviewsAsCandidate: async (candidateId) => {
    try {
      const response = await axios.get(`${API_URL}/interviews?candidateId=${candidateId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching interviews as candidate:', error);
      throw error;
    }
  },

  /**
   * Get a specific interview by ID
   * @param {string} interviewId - Interview ID
   * @returns {Promise<object>} Interview data
   */
  getInterviewById: async (interviewId) => {
    try {
      const response = await axios.get(`${API_URL}/interviews/${interviewId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching interview:', error);
      throw error;
    }
  },

  /**
   * Update interview status
   * @param {string} interviewId - Interview ID
   * @param {string} status - New status ("scheduled", "completed", "canceled")
   * @returns {Promise<object>} Updated interview data
   */
  updateInterviewStatus: async (interviewId, status) => {
    try {
      const response = await axios.patch(`${API_URL}/interviews/${interviewId}/status`, {
        status
      });
      return response.data;
    } catch (error) {
      console.error('Error updating interview status:', error);
      throw error;
    }
  },

  /**
   * Reschedule an interview
   * @param {string} interviewId - Interview ID
   * @param {Date} newStartTime - New start time
   * @param {number} newDuration - New duration in minutes
   * @returns {Promise<object>} Updated interview data
   */
  rescheduleInterview: async (interviewId, newStartTime, newDuration) => {
    try {
      const response = await axios.patch(`${API_URL}/interviews/${interviewId}/reschedule`, {
        startTime: newStartTime,
        duration: newDuration
      });
      return response.data;
    } catch (error) {
      console.error('Error rescheduling interview:', error);
      throw error;
    }
  },

  /**
   * Get all upcoming interviews for a user (both as interviewer and candidate)
   * @param {string} userId - User ID from session
   * @param {string} candidateId - Candidate ID from user profile
   * @returns {Promise<Array>} Combined list of upcoming interviews
   */
  getUpcomingInterviews: async (userId, candidateId) => {
    try {
      const [asInterviewer, asCandidate] = await Promise.all([
        this.getInterviewsAsInterviewer(userId),
        candidateId ? this.getInterviewsAsCandidate(candidateId) : Promise.resolve([])
      ]);
      
      // Combine and filter for upcoming interviews
      const now = new Date();
      const allInterviews = [...asInterviewer, ...asCandidate];
      
      return allInterviews.filter(interview => 
        new Date(interview.startTime) > now && 
        interview.status === 'scheduled'
      ).sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
    } catch (error) {
      console.error('Error fetching upcoming interviews:', error);
      throw error;
    }
  }
};