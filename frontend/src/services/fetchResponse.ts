import axios from "axios";

export const fetchResponse = async (question: string): Promise<string> => {
  try {
    const result = await axios.post("http://localhost:8081/respond/", {
      question,
    });
    return result.data.response;
  } catch (error) {
    throw new Error("Error fetching response.");
  }
};
