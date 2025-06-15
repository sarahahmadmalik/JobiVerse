const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const generateResume = async (userData, jobData) => {
  try {
    const response = await fetch(`${API_URL}/generate-resume-content`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userData, jobData }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate resume');
    }

    return await response.json();
  } catch (error) {
    console.error('Error generating resume:', error);
    throw error;
  }
};