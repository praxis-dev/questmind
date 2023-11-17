// authenticateUser.ts (frontend)

import axios from "axios";

interface UserData {
  email: string;
  password: string;
}

interface ApiResponse {
  message: string;
  user?: {
    email: string;
    id: string;
  };
  token?: string;
}

const apiUrl = `${process.env.REACT_APP_API_URL}/users/login`;

const isTokenPresent = () => {
  const token = localStorage.getItem("token");
  return !!token;
};

export const authenticateUser = async (
  userData: UserData
): Promise<ApiResponse> => {
  try {
    console.log(userData);
    const response = await axios.post<ApiResponse>(apiUrl, userData);

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);

      console.log(isTokenPresent());
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return Promise.reject(error.response.data.message);
    } else {
      console.error("Error during authentication:", error);
      return Promise.reject("An unknown error occurred during authentication.");
    }
  }
};
