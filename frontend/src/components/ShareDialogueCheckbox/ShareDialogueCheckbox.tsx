import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, notification, Space } from "antd";
import { ShareAltOutlined, LinkOutlined } from "@ant-design/icons";
import { toggleShareDialogue } from "../../services/toggleShareDialogue";
import { RootState } from "../../store";
import {
  setSharedStatus,
  setDialogueLink,
} from "../../store/slices/dialogueSharingSlice";
import Switch from "react-switch"; // Importing react-switch

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

  const handleSwitchChange = async (checked: boolean) => {
    const shouldShare = checked;

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
      dispatch(setSharedStatus(shouldShare));

      if (shouldShare && response.link) {
        dispatch(setDialogueLink(response.link));
        copyToClipboard(response.link);
        notification.success({
          message: "Dialogue Shared",
          description: "The dialogue has been shared successfully.",
          placement: "top",
        });
      } else if (!shouldShare) {
        dispatch(setDialogueLink(undefined));
        notification.info({
          message: "Dialogue Unshared",
          description: "The dialogue has been unshared.",
          placement: "top",
        });
      }
    } catch (error) {
      notification.error({
        message: "Error sharing/unsharing dialogue",
        description: error instanceof Error ? error.message : String(error),
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
      <div
        style={{
          borderRadius: "5px",
          padding: "3px",
          border: "1px solid #d9d9d9",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Switch
          onChange={handleSwitchChange}
          checked={isShared}
          height={25}
          width={50}
          handleDiameter={25}
          offColor="grey"
          onColor="grey"
          onHandleColor="#cd7f32"
          offHandleColor="#D3D3D3"
        />
        <Button
          type="text"
          size="small"
          style={{ marginLeft: 8 }}
          onClick={() => dialogueLink && copyToClipboard(dialogueLink)}
          disabled={!isShared || !dialogueLink}
        >
          <ShareAltOutlined style={{ fontSize: 20 }} />
        </Button>
      </div>
    </>
  );
};

export default ShareDialogueCheckbox;
