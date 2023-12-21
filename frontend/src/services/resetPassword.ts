import axios from "axios";

interface ResetPasswordData {
  token: string;
  newPassword: string;
}

const apiUrl = `${process.env.REACT_APP_API_URL}/users/reset-password`;

export const resetPassword = async (
  data: ResetPasswordData
): Promise<string> => {
  try {
    const response = await axios.post(apiUrl, data);
    return response.data.message;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return Promise.reject(error.response.data.message);
    } else {
      return Promise.reject("An unknown error occurred.");
    }
  }
};
