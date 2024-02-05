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

    localStorage.clear(); // Clear storage after successful deletion

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Now TypeScript knows error is an AxiosError, which has a `response` property
      const serverError = error as AxiosError<{ message: string }>;
      if (serverError && serverError.response) {
        return Promise.reject(serverError.response.data.message);
      }
    }
    // Handle non-Axios errors
    return Promise.reject("An unknown error occurred while deleting the user.");
  }
};
