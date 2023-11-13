import axios from "axios";

interface ResetPasswordRequestData {
  email: string;
}

const apiUrl = `${process.env.REACT_APP_API_URL}/users/reset-password-request`;

export const resetPasswordRequest = async (
  data: ResetPasswordRequestData
): Promise<string> => {
  try {
    console.log("resetPasswordRequestData", data);
    const response = await axios.post(apiUrl, data);
    return response.data.message;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return Promise.reject(error.response.data.message);
    } else {
      console.error("Error requesting password reset:", error);
      return Promise.reject("An unknown error occurred.");
    }
  }
};
