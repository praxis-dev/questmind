//createUser.ts (frontend)

import axios from "axios";

interface UserData {
  email: string;
  password: string;
}

interface CreateUserResponse {
  message: string;
  user?: {
    email: string;
    id: string;
  };
  token?: string;
}

const apiUrl = `${process.env.REACT_APP_API_URL}/users`;

export const createUser = async (
  userData: UserData
): Promise<CreateUserResponse> => {
  try {
    const response = await axios.post<CreateUserResponse>(apiUrl, userData);

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return Promise.reject(error.response.data.message);
    } else {
      return Promise.reject("An unknown error occurred.");
    }
  }
};
