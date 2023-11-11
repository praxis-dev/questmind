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
  console.log("apiUrl", apiUrl);
  console.log("userData", userData);
  if (!apiUrl) {
    throw new Error("REACT_APP_API_URL environment variable not set");
  }

  try {
    const response = await axios.post<ApiResponse>(apiUrl, userData);
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Error creating user.");
  }
};
