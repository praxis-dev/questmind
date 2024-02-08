import axios from "axios";

export interface Message {
  messageId: string;
  sender: string;
  message: string;
  timestamp: Date;
  important: boolean;
}

export interface Dialogue {
  _id: string;
  userId: string;
  messages: Message[];
  isBranch: boolean;
  parentDialogueId?: string | null;
  createdAt: Date;
  updatedAt?: Date;
  isShared: boolean;
  shareIdentifier?: string | null;
  dialogueLink?: string;
}

const dialogueApiUrl = `${process.env.REACT_APP_API_URL}/respond/dialogue`;

export const fetchDialogueById = async (
  dialogueId: string
): Promise<Dialogue> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found.");
    }

    const url = `${dialogueApiUrl}/${dialogueId}`;
    const response = await axios.get<Dialogue>(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.data.isShared) {
      console.log(`The dialogue ${dialogueId} is shared.`);
    } else {
      console.log(`The dialogue ${dialogueId} is not shared.`);
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return Promise.reject(error.response.data.message);
    } else {
      return Promise.reject(
        "An unknown error occurred while fetching the dialogue."
      );
    }
  }
};
