import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Checkbox, Button, notification } from "antd";
import { toggleShareDialogue } from "../../services/toggleShareDialogue";
import { RootState } from "../../store";
import {
  setSharedStatus,
  setDialogueLink,
} from "../../store/slices/dialogueSharingSlice";

const ShareDialogueCheckbox = () => {
  const dispatch = useDispatch();
  const selectedDialogueId = useSelector(
    (state: RootState) => state.dialogue.selectedDialogueId
  );
  const isShared = useSelector(
    (state: RootState) => state.dialogueSharing.isShared
  );
  const dialogueLink = useSelector(
    (state: RootState) => state.dialogueSharing.dialogueLink
  );

  useEffect(() => {
    // No need to dispatch setSharedStatus here as it's handled in handleCheckboxChange
  }, [selectedDialogueId, isShared, dialogueLink]);

  const handleCheckboxChange = async (e: any) => {
    const shouldShare = e.target.checked;

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
      dispatch(setSharedStatus(shouldShare)); // Update shared status in Redux store

      if (shouldShare && response.link) {
        dispatch(setDialogueLink(response.link)); // Update dialogue link in Redux store
        notification.success({
          message: "Dialogue Shared",
          description: "The dialogue has been shared successfully.",
          placement: "top",
        });
      } else if (!shouldShare) {
        dispatch(setDialogueLink(undefined)); // Clear dialogue link in Redux store
        notification.info({
          message: "Dialogue Unshared",
          description: "The dialogue has been unshared.",
          placement: "top",
        });
      }
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error(error);
      notification.error({
        message: "Error sharing/unsharing dialogue",
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
      <Checkbox checked={isShared} onChange={handleCheckboxChange}>
        {isShared ? "Dialogue Shared" : "Share Dialogue"}
      </Checkbox>
      {isShared && dialogueLink && (
        <Button
          type="primary"
          size="small"
          style={{ marginLeft: 8 }}
          onClick={() => copyToClipboard(dialogueLink)}
        >
          Copy Link
        </Button>
      )}
    </>
  );
};

export default ShareDialogueCheckbox;
