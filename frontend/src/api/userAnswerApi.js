import axios from 'axios';

const api_base_url = 'http://localhost:8021/api/assignments';

export const getAssignmentsByUser = async (quizId, userId) => {
  try {
    const response = await axios.get(
      `${api_base_url}/quiz/${quizId}/results/${userId}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching assignments:', error);
    return [];
  }
};

export const submitQuizAnswers = async (quizId, userId, answers) => {
  try {
    const response = await axios.post(`${api_base_url}/quiz/submit`, {
      quizId,
      userId,
      answers,
    });
    return response.data;
  } catch (error) {
    console.error('Error submitting quiz answers:', error);
    return { message: 'Server error' };
  }
};
