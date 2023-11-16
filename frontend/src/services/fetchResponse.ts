import axios from "axios";

const endpoint = "/respond";
const apiUrl = `${process.env.REACT_APP_API_URL}${endpoint}`;

type RequestBody = {
  question: string;
  dialogueId?: string;
};

export const fetchResponse = async (
  question: string,
  dialogueId?: string
): Promise<{ data: string; dialogueId: string }> => {
  if (!apiUrl) {
    throw new Error("REACT_APP_API_URL environment variable not set");
  }

  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No authentication token found.");
  }

  try {
    const requestBody: RequestBody = { question };
    if (dialogueId) {
      requestBody.dialogueId = dialogueId;
    }

    const result = await axios.post(apiUrl, requestBody, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Dialogue ID:", result.data.dialogueId); // Log the dialogue ID
    return result.data;
  } catch (error) {
    console.error("Error fetching response:", error);
    throw new Error("Error fetching response.");
  }
};
