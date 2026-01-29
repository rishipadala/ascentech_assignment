import api from '@/utils/api';
import Cookies from 'js-cookie';

export const loginUser = async (userData: any) => {
  try {
    const response = await api.post('users/login/', userData);
    // Save token and username for 1 day
    Cookies.set('token', response.data.access, { expires: 1 });
    Cookies.set('username', userData.username, { expires: 1 });
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.detail || "Login failed";
  }
};

export const getUsername = (): string | undefined => {
  return Cookies.get('username');
};

export const registerUser = async (userData: any) => {
  try {
    const response = await api.post('users/register/', userData);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || "Registration failed";
  }
};

export const logoutUser = () => {
  Cookies.remove('token');
  window.location.href = '/login';
};