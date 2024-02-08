// deleteUser.ts

import axios, { AxiosError } from "axios";

interface DeleteUserResponse {
  message: string;
}

const deleteUserApiUrl = `${process.env.REACT_APP_API_URL}/users/me`;

export const deleteUser = async (): Promise<DeleteUserResponse> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token not found.");
    }

    const response = await axios.delete<DeleteUserResponse>(deleteUserApiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    localStorage.clear();

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const serverError = error as AxiosError<{ message: string }>;
      if (serverError && serverError.response) {
        return Promise.reject(serverError.response.data.message);
      }
    }
    return Promise.reject("An unknown error occurred while deleting the user.");
  }
};
