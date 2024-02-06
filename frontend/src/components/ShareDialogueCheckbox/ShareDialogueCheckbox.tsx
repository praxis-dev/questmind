import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Checkbox, notification, Button } from "antd";
import { toggleShareDialogue } from "../../services/toggleShareDialogue";
import { RootState } from "../../store";

const ShareDialogueCheckbox = () => {
  const selectedDialogueId = useSelector(
    (state: RootState) => state.dialogue.selectedDialogueId
  );
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    setIsChecked(false);
  }, [selectedDialogueId]);

  const handleCheckboxChange = async (e: any) => {
    const shouldShare = e.target.checked;
    setIsChecked(shouldShare);

    if (!selectedDialogueId) {
      notification.error({
        message: "No dialogue selected",
        placement: "top",
      });
      return;
    }

    try {
      const response = await toggleShareDialogue(
        selectedDialogueId,
        shouldShare
      );
      if (shouldShare) {
        if (response.link) {
          notification.open({
            message: "Dialogue Shared",
            description: `Link: ${response.link}`,
            placement: "top",
            btn: (
              <Button
                type="primary"
                size="small"
                onClick={() => response.link && copyToClipboard(response.link)}
              >
                Copy Link
              </Button>
            ),
            duration: 0, // Optional: adjust based on your needs
          });
        } else {
          notification.error({
            message: "Link is unavailable",
            placement: "top",
          });
        }
      } else {
        notification.info({
          message: "Dialogue Unshared",
          placement: "top",
        });
      }
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error(error);
      notification.error({
        message: "Error",
        description: errorMessage,
        placement: "top",
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        notification.success({
          message: "Success",
          description: "Link copied to clipboard",
          placement: "top",
        });
      },
      (err) => {
        notification.error({
          message: "Failed to copy link",
          description: `Error: ${err}`,
          placement: "top",
        });
        console.error("Failed to copy: ", err);
      }
    );
  };

  return (
    <>
      <Checkbox checked={isChecked} onChange={handleCheckboxChange}>
        Share Dialogue
      </Checkbox>
    </>
  );
};

export default ShareDialogueCheckbox;
