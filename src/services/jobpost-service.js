import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const createJobPost = async (jobData) => {
  try {
    const response = await axios.post(`${API_URL}/job-posts`, jobData);
    return response.data;
  } catch (error) {
    console.error('Error creating job post:', error);
    throw error;
  }
};

export const getAllJobPosts = async () => {
  try {
    const response = await axios.get(`${API_URL}/job-posts/getAll`);
    return response.data;
  } catch (error) {
    console.error('Error fetching job posts:', error);
    throw error;
  }
};

export const getJobPosts = async (recruiterId) => {
  try {
    const response = await axios.get(`${API_URL}/job-posts?recruiterId=${recruiterId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching job posts:', error);
    throw error;
  }
};

export const getJobPostById = async (jobId) => {
  try {
    const response = await axios.get(`${API_URL}/job-posts/${jobId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching job post:', error);
    throw error;
  }
};

export const updateJobPost = async (jobId, jobData) => {
  try {
    const response = await axios.put(`${API_URL}/job-posts/${jobId}`, jobData);
    return response.data;
  } catch (error) {
    console.error('Error updating job post:', error);
    throw error;
  }
};

export const deleteJobPost = async (jobId) => {
  try {
    const response = await axios.delete(`${API_URL}/job-posts/${jobId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting job post:', error);
    throw error;
  }
};