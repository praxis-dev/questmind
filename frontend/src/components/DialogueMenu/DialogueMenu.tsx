import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";

import { Button, Drawer, Space, Card, Typography } from "antd";
import { UnorderedListOutlined, CloseOutlined } from "@ant-design/icons";
import { useResponsiveStyles } from "../../library/hooks";
import { Breakpoint, ViewStyles } from "../../library/styles";

import { fetchDialogues } from "../../store/slices/dialogueIndexSlice";
import { fetchDialogueById } from "../../services/fetchDialogueById";
import { deleteDialogue } from "../../services/deleteDialogue";
import { setSelectedDialogueId } from "../../store/slices/dialogueIdSlice";
import { setSelectedDialogue } from "../../store/slices/dialogueDetailsSlice";
import { clearMessages } from "../../store/slices/chatSlice";
import { openDrawer, closeDrawer } from "../../store/slices/drawerSlice";
import { dialogueIndexSlice } from "../../store/slices/dialogueIndexSlice";

import { DialogueSummary } from "../../services/fetchUserDialogues";

import { RootState, AppDispatch } from "../../store/store";

import io from "socket.io-client";

import { Flipper, Flipped } from "react-flip-toolkit";

import styled, { keyframes } from "styled-components";

const LargeUnorderedListOutlined = styled(UnorderedListOutlined)`
  font-size: 25px;
  color: grey;
`;

const pulsate = keyframes`
  0% { border-color: transparent; }
  50% { border-color: #cd7f32; }
  100% { border-color: transparent; }
`;

const PulsatingButton = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  margin: 2px 0;
  border: 1px solid transparent;
  transition: border 0.5s ease-in-out;

  &:hover {
    animation: ${pulsate} 4s infinite;
    border: 1px solid black;

    svg {
      color: #cd7f32; // Change icon color on hover
    }
  }
`;

const pulsateCard = keyframes`
  0% { border-color: black; }
  50% { border-color: #cd7f32; }
  100% { border-color: black; }
`;

const StyledCard = styled(Card)`
  &.selected {
    animation: ${pulsateCard} 4s infinite;
    border: 1px solid black;
  }
  margin-bottom: 10px;
`;

const DialogueMenu: React.FC = () => {
  const socket = io("http://localhost:3001");
  const [sortedDialogues, setSortedDialogues] = useState<DialogueSummary[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  const selectedDialogueId = useSelector(
    (state: RootState) => state.dialogue.selectedDialogueId
  );

  const styles = useResponsiveStyles(baseStyles, {
    [Breakpoint.ExtraLarge]: extraLargeScreenStyles,
    [Breakpoint.Large]: largeScreenStyles,
    [Breakpoint.Medium]: mediumScreenStyles,
    [Breakpoint.Small]: smallScreenStyles,
    [Breakpoint.ExtraSmall]: extraSmallScreenStyles,
  });

  const dialogues = useSelector(
    (state: RootState) => state.dialogueIndex.dialogues
  );

  const { Paragraph } = Typography;

  const dispatch = useDispatch<AppDispatch>();

  const isOpen = useSelector((state: RootState) => state.drawer.isOpen);

  const showDrawer = () => {
    dispatch(openDrawer());
  };

  const onClose = () => {
    dispatch(closeDrawer());
  };

  const status = useSelector((state: RootState) => state.dialogueIndex.status);

  const handleCardClick = (dialogueId: string) => {
    console.log(`Dialogue clicked: ${dialogueId}`);

    dispatch(setSelectedDialogueId(dialogueId));
    setSelectedCardId(dialogueId); // Update the selected card ID

    console.log(`Fetching dialogue: ${dialogueId}`);

    fetchDialogueById(dialogueId)
      .then((dialogue) => {
        console.log(dialogue);

        dispatch(setSelectedDialogue(dialogue));
      })
      .catch((error) => {
        console.error("Error fetching dialogue:", error);
      });
  };

  const handleDialogueDelete = (dialogueId: string) => {
    console.log(`Deleting dialogue: ${dialogueId}`);

    deleteDialogue(dialogueId)
      .then(() => {
        console.log("Dialogue deleted.");
        if (selectedDialogueId === dialogueId) {
          dispatch(clearMessages());
        }
        dispatch(dialogueIndexSlice.actions.deleteDialogue(dialogueId));
      })
      .catch((error) => {
        console.error("Error deleting dialogue:", error);
      });
  };

  useEffect(() => {
    const sorted = [...dialogues].sort((a, b) => {
      const dateA = new Date(a.updatedAt).getTime();
      const dateB = new Date(b.updatedAt).getTime();
      console.log(dateA, dateB);

      return dateB - dateA;
    });

    setSortedDialogues(sorted);
  }, [dialogues]);

  useEffect(() => {
    dispatch(fetchDialogues());
  }, [dispatch]);

  useEffect(() => {
    if (status === "succeeded") {
      console.log("Fetched Dialogues:", dialogues);
    }
  }, [status, dialogues]);

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchDialogues());
    }
  }, [isOpen, dispatch]);

  useEffect(() => {
    socket.on("dialogueUpdated", (data) => {
      console.log("Dialogue updated via websocket:", data);

      const updatedDialogues = sortedDialogues.map((dialogue) => {
        if (dialogue.dialogueId === data.dialogueId) {
          return { ...dialogue, updatedAt: data.updatedData.updatedAt };
        }
        return dialogue;
      });

      // Re-sort the dialogues based on updatedAt
      updatedDialogues.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );

      // Update state with the new sorted array
      setSortedDialogues(updatedDialogues);
    });

    return () => {
      socket.off("dialogueUpdated");
    };
  }, [sortedDialogues]);

  if (status === "failed") {
    return <p>Failed to fetch dialogues.</p>;
  }

  return (
    <>
      <Space>
        <PulsatingButton
          type="link"
          onClick={showDrawer}
          style={styles.buttonStyle}
        >
          <LargeUnorderedListOutlined />
        </PulsatingButton>
      </Space>
      <Drawer
        title="My Dialogues "
        placement="left"
        closable={true}
        onClose={onClose}
        open={isOpen}
        key={"left"}
      >
        <Space direction="vertical">
          <Flipper flipKey={sortedDialogues}>
            {sortedDialogues.map((dialogue) => (
              <Flipped key={dialogue.dialogueId} flipId={dialogue.dialogueId}>
                <StyledCard
                  size="small"
                  key={dialogue.dialogueId}
                  title={new Date(dialogue.createdAt).toLocaleDateString()}
                  onClick={() => handleCardClick(dialogue.dialogueId)}
                  extra={
                    <CloseOutlined
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDialogueDelete(dialogue.dialogueId);
                      }}
                    />
                  }
                  className={
                    selectedCardId === dialogue.dialogueId ? "selected" : ""
                  }
                >
                  <p>
                    <Paragraph
                      ellipsis={{
                        rows: 4,
                        expandable: false,
                      }}
                    >
                      {dialogue.firstMessage}
                    </Paragraph>
                  </p>
                </StyledCard>
              </Flipped>
            ))}
          </Flipper>
        </Space>
      </Drawer>
    </>
  );
};

const baseStyles: ViewStyles = {
  test: {
    height: "100vh",
  },

  contentSpace: {
    margin: "auto auto",
    boxSizing: "border-box",
    padding: "20px",
    maxWidth: "800px",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  textArea: {
    textAlign: "left",
  },

  buttonStyle: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },

  listIcon: {
    fontSize: 20,
    color: "grey",
  },

  selectedCardStyle: {
    borderColor: "blue",
    borderWidth: "2px",
    borderStyle: "solid",
  },
};

const extraLargeScreenStyles: ViewStyles = {};

const largeScreenStyles: ViewStyles = {};

const mediumScreenStyles: ViewStyles = {};

const smallScreenStyles: ViewStyles = {};

const extraSmallScreenStyles: ViewStyles = {};

export default DialogueMenu;
