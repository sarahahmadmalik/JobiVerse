import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getCandidateProfile = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/candidate/profile/getProfile?id=${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching candidate profile:', error);
    throw error;
  }
};


export const updateCandidateProfile = async (userId, section, data) => {
  try {
    const response = await axios.put(`${API_URL}/candidate/profile/putProfile`, {
      userId,
      section,
      data
    });
    return response.data;
  } catch (error) {
    console.error('Error updating candidate profile:', error);
    throw error;
  }
};