import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getRecruiterProfile = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/recruiter/profile/getProfile?id=${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching recruiter profile:', error);
    throw error;
  }
};

export const updateRecruiterProfile = async (userId, section, data) => {
  try {
    const response = await axios.put(`${API_URL}/recruiter/profile/putProfile`, {
      userId,
      section,
      data
    });
    return response.data;
  } catch (error) {
    console.error('Error updating recruiter profile:', error);
    throw error;
  }
};