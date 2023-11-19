//delete dialogue (frontend)

import axios from "axios";

const endpoint = "/respond/dialogue";
const apiUrl = `${process.env.REACT_APP_API_URL}${endpoint}`;

export const deleteDialogue = async (
  dialogueId: string
): Promise<{ message: string }> => {
  if (!apiUrl) {
    throw new Error("REACT_APP_API_URL environment variable not set");
  }

  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No authentication token found.");
  }

  try {
    console.log("Deleting dialogue:", dialogueId);
    const deleteUrl = `${apiUrl}/${dialogueId}`;
    const result = await axios.delete(deleteUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Delete response:", result.data.message);
    return result.data;
  } catch (error) {
    console.error("Error deleting dialogue:", error);
    throw new Error("Error deleting dialogue.");
  }
};
