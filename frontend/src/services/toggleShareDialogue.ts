import axios, { AxiosError } from "axios"; // Import AxiosError for type checking

const endpoint = "/respond/dialogue";
const apiUrl = `${process.env.REACT_APP_API_URL}${endpoint}`;

export const toggleShareDialogue = async (
  dialogueId: string,
  isShared: boolean
): Promise<{ message: string; link?: string }> => {
  if (!apiUrl) {
    throw new Error("REACT_APP_API_URL environment variable not set");
  }

  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No authentication token found.");
  }

  try {
    const actionUrl = `${apiUrl}/${dialogueId}/${
      isShared ? "share" : "unshare"
    }`;
    const result = await axios.post(
      actionUrl,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return result.data; // This will contain the message and, if shared, the shareable link
  } catch (error) {
    // Use a type guard to check if the error is an AxiosError
    if (axios.isAxiosError(error)) {
      console.error(
        "Error toggling share status of dialogue.",
        error.response?.data || error.message
      );
      throw new Error(
        `Failed to ${isShared ? "share" : "unshare"} dialogue. ${
          error.response?.data || error.message
        }`
      );
    } else {
      // For non-Axios errors, just use a generic message
      console.error("An unexpected error occurred.", error);
      throw new Error("An unexpected error occurred.");
    }
  }
};
