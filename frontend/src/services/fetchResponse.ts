import axios from "axios";
const endpoint = "/respond";

const apiUrl = `${process.env.REACT_APP_API_URL}${endpoint}`;

export const fetchResponse = async (question: string): Promise<string> => {
  if (!apiUrl) {
    throw new Error("REACT_APP_API_URL environment variable not set");
  }

  try {
    const result = await axios.post(apiUrl, {
      question,
    });
    return result.data;
  } catch (error) {
    console.error("Error fetching response:", error);
    throw new Error("Error fetching response.");
  }
};
