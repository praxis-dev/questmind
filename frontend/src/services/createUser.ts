import axios from "axios";

interface UserData {
  email: string;
  password: string;
}

interface ApiResponse {
  message: string;
}

const apiUrl = `${process.env.REACT_APP_API_URL}/users`;

export const createUser = async (userData: UserData): Promise<ApiResponse> => {
  try {
    const response = await axios.post<ApiResponse>(apiUrl, userData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return Promise.reject(error.response.data.message);
    } else {
      console.error("Error creating user:", error);
      return Promise.reject("An unknown error occurred.");
    }
  }
};
