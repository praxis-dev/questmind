import axios from "axios";

interface ResetPasswordRequestData {
  email: string;
}

const apiUrl = `${process.env.REACT_APP_API_URL}/users/reset-password-request`;

export const resetPasswordRequest = async (
  data: ResetPasswordRequestData
): Promise<string> => {
  try {
    const response = await axios.post(apiUrl, data);
    return response.data.message;
  } catch (error) {
    console.log("Caught error in resetPasswordRequest:", error);

    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.log("Axios error with response:", error.response);
        return Promise.reject(error.response.data.message);
      }
      // console.error("Axios error without response:", error);
      return Promise.reject(error.message);
    } else if (error instanceof Error) {
      console.log("Non-Axios Error:", error);
      return Promise.reject(error.message);
    } else {
      console.log("Unknown error type:", error);
      return Promise.reject("An unknown error occurred.");
    }
  }
};
