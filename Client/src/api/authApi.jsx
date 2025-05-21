import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/auth/login';

export const loginStudent = async ({ semester, department, regNumber, password }) => {
  const body = {
    batch: semester.toLowerCase().replace(' ', '-'),
    department: department.toLowerCase(),
    regNo: regNumber,
    password,
  };
  const response = await axios.post(`${API_BASE_URL}/student`, body);
  return response.data;
};

export const loginTutor = async ({ email, password }) => {
  const body = { email, password };
  const response = await axios.post(`${API_BASE_URL}/tutor`, body);
  return response.data;
};

export const loginAdmin = async ({ email, password }) => {
  const body = { email, password };
  const response = await axios.post(`${API_BASE_URL}/admin`, body);
  return response.data;
};
