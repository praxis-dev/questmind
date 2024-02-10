import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, message } from "antd";
import { ShareAltOutlined } from "@ant-design/icons";
import { toggleShareDialogue } from "../../services/toggleShareDialogue";
import { RootState } from "../../store";
import {
  setSharedStatus,
  setDialogueLink,
} from "../../store/slices/dialogueSharingSlice";
import Switch from "react-switch";

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
      message.error("No dialogue selected");
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
      } else if (!shouldShare) {
        dispatch(setDialogueLink(undefined));
      }
    } catch (error) {
      message.error("Error sharing/unsharing dialogue");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        message.success("Dialogue link copied to clipboard");
      },
      (err) => {
        console.error("Failed to copy: ", err);
        message.error("Failed to copy link");
      }
    );
  };

  return (
    <>
      <div
        style={{
          borderRadius: "5px",
          padding: "3px",
          border: isShared ? "1px solid #cd7f32" : "1px solid #D3D3D3",
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
          boxShadow=""
          activeBoxShadow=""
        />
        <Button
          type="text"
          size="small"
          style={{ marginLeft: "3px" }}
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
