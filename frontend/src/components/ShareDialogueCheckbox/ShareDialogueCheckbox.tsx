import React, { useState, useEffect, ChangeEvent } from "react";
import { useSelector } from "react-redux";
import { toggleShareDialogue } from "../../services/toggleShareDialogue";
import { RootState } from "../../store";

const ShareDialogueCheckbox = () => {
  // Access the selected dialogue ID from the Redux store
  const selectedDialogueId = useSelector(
    (state: RootState) => state.dialogue.selectedDialogueId
  );
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    // Reset the checkbox state when the selectedDialogueId changes
    setIsChecked(false); // You might want to fetch the current share status instead
  }, [selectedDialogueId]);

  const handleCheckboxChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const shouldShare = event.target.checked;
    setIsChecked(shouldShare);

    if (!selectedDialogueId) {
      alert("No dialogue selected.");
      return;
    }

    try {
      const response = await toggleShareDialogue(
        selectedDialogueId,
        shouldShare
      );
      if (shouldShare) {
        alert(`Dialogue shared. Link: ${response.link}`);
      } else {
        alert("Dialogue unshared.");
      }
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error(error);
      alert(errorMessage);
    }
  };

  return (
    <label>
      Share Dialogue
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleCheckboxChange}
      />
    </label>
  );
};

export default ShareDialogueCheckbox;
