import axios from "axios";

interface DialogueSummary {
  dialogueId: string;
  firstMessage: string;
}

const dialoguesApiUrl = `${process.env.REACT_APP_API_URL}/respond/dialogues`;

export const fetchUserDialogues = async (): Promise<DialogueSummary[]> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found.");
    }

    const response = await axios.get<DialogueSummary[]>(dialoguesApiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return Promise.reject(error.response.data.message);
    } else {
      console.error("Error fetching dialogues:", error);
      return Promise.reject(
        "An unknown error occurred while fetching dialogues."
      );
    }
  }
};
