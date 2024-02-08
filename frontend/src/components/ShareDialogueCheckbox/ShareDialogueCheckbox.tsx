import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Checkbox, Button, notification, Space } from "antd";
import { toggleShareDialogue } from "../../services/toggleShareDialogue";
import { RootState } from "../../store";
import {
  setSharedStatus,
  setDialogueLink,
} from "../../store/slices/dialogueSharingSlice";

import { CopyOutlined } from "@ant-design/icons";

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
      dispatch(setSharedStatus(shouldShare));

      if (shouldShare && response.link) {
        dispatch(setDialogueLink(response.link));
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
      <Space
        style={{
          border: "1px solid grey",
          borderRadius: "5px",
          padding: "3px",
        }}
      >
        <Checkbox
          checked={isShared}
          onChange={handleCheckboxChange}
          style={{
            borderRadius: "5px",
            padding: "3px",
          }}
        >
          {isShared ? "Shared" : "Share"}
        </Checkbox>
        {isShared && dialogueLink && (
          <Button
            type="primary"
            size="small"
            style={{ marginLeft: 8 }}
            onClick={() => copyToClipboard(dialogueLink)}
            icon={<CopyOutlined />}
          ></Button>
        )}
      </Space>
    </>
  );
};

export default ShareDialogueCheckbox;
