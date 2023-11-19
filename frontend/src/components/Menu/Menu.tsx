import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";

import { Button, Drawer, Space, Card } from "antd";
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

const Menu: React.FC = () => {
  const [open, setOpen] = useState(false);

  const [sortedDialogues, setSortedDialogues] = useState<DialogueSummary[]>([]);

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
        dispatch(clearMessages());
        dispatch(dialogueIndexSlice.actions.deleteDialogue(dialogueId));
        // Do not dispatch fetchDialogues here
      })
      .catch((error) => {
        console.error("Error deleting dialogue:", error);
      });
  };

  useEffect(() => {
    const sorted = [...dialogues].sort((a, b) => {
      const dateA = new Date(a.updatedAt).getTime();
      const dateB = new Date(b.updatedAt).getTime();

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

  // if (status === "loading") {
  //   return <p>Loading...</p>;
  // }

  if (status === "failed") {
    return <p>Failed to fetch dialogues.</p>;
  }

  return (
    <>
      <Space>
        <Button
          type="link"
          onClick={showDrawer}
          icon={<UnorderedListOutlined style={styles.listIcon} />}
          style={styles.buttonStyle}
        ></Button>
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
          {sortedDialogues.map((dialogue) => (
            <Card
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
            >
              <p>{dialogue.firstMessage}</p>
            </Card>
          ))}
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
};

const extraLargeScreenStyles: ViewStyles = {};

const largeScreenStyles: ViewStyles = {};

const mediumScreenStyles: ViewStyles = {};

const smallScreenStyles: ViewStyles = {};

const extraSmallScreenStyles: ViewStyles = {};

export default Menu;
