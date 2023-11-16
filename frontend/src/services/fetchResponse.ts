import axios from "axios";

const endpoint = "/respond";
const apiUrl = `${process.env.REACT_APP_API_URL}${endpoint}`;

export const fetchResponse = async (question: string): Promise<string> => {
  if (!apiUrl) {
    throw new Error("REACT_APP_API_URL environment variable not set");
  }

  const token = localStorage.getItem("token");
  console.log("token from the frontend", token);

  if (!token) {
    throw new Error("No authentication token found.");
  }

  try {
    const result = await axios.post(
      apiUrl,
      { question },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return result.data;
  } catch (error) {
    console.error("Error fetching response:", error);
    throw new Error("Error fetching response.");
  }
};
