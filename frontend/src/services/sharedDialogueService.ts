// SharedDialogueService.ts

import axios from "axios";
import { Dialogue } from "./fetchDialogueById";

const baseUrl = process.env.REACT_APP_API_URL; // Ensure this environment variable is set in your .env file

// Function to fetch shared dialogue by shareIdentifier
export const fetchSharedDialogue = async (
  shareIdentifier: string
): Promise<Dialogue> => {
  try {
    const url = `${baseUrl}/shared/${shareIdentifier}`;
    const response = await axios.get<Dialogue>(url);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle HTTP errors (e.g., 404 Not Found)
      throw new Error(
        error.response?.data.message || "Failed to fetch the shared dialogue"
      );
    } else {
      // Handle non-HTTP errors (e.g., network issues)
      throw new Error(
        "An unknown error occurred while fetching the shared dialogue"
      );
    }
  }
};
