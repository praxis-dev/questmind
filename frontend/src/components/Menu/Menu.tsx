import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { Button, Drawer, Space, Card } from "antd";
import { UnorderedListOutlined } from "@ant-design/icons";
import { useResponsiveStyles } from "../../library/hooks";
import { Breakpoint, ViewStyles } from "../../library/styles";

import { fetchDialogues } from "../../store/slices/dialogueIndexSlice";
import { fetchDialogueById } from "../../services/fetchDialogueById";
import { setSelectedDialogueId } from "../../store/slices/dialogueIdSlice";
import { setSelectedDialogue } from "../../store/slices/dialogueDetailsSlice";

import { RootState, AppDispatch } from "../../store/store";

const Menu: React.FC = () => {
  const [open, setOpen] = useState(false);

  const styles = useResponsiveStyles(baseStyles, {
    [Breakpoint.ExtraLarge]: extraLargeScreenStyles,
    [Breakpoint.Large]: largeScreenStyles,
    [Breakpoint.Medium]: mediumScreenStyles,
    [Breakpoint.Small]: smallScreenStyles,
    [Breakpoint.ExtraSmall]: extraSmallScreenStyles,
  });

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const dispatch = useDispatch<AppDispatch>();

  const dialogues = useSelector(
    (state: RootState) => state.dialogueIndex.dialogues
  );
  const status = useSelector((state: RootState) => state.dialogueIndex.status);

  const handleCardClick = (dialogueId: string) => {
    console.log(`Dialogue clicked: ${dialogueId}`);

    dispatch(setSelectedDialogueId(dialogueId));

    fetchDialogueById(dialogueId)
      .then((dialogue) => {
        console.log(dialogue);

        dispatch(setSelectedDialogue(dialogue));
      })
      .catch((error) => {
        console.error("Error fetching dialogue:", error);
      });
  };

  useEffect(() => {
    dispatch(fetchDialogues());
  }, [dispatch]);

  useEffect(() => {
    if (status === "succeeded") {
      console.log("Fetched Dialogues:", dialogues);
    }
  }, [status, dialogues]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

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
        open={open}
        key={"left"}
      >
        {dialogues.map((dialogue) => (
          <Card
            key={dialogue.dialogueId}
            title={new Date(dialogue.createdAt).toLocaleDateString()}
            onClick={() => handleCardClick(dialogue.dialogueId)}
          >
            <p>{dialogue.firstMessage}</p>
          </Card>
        ))}
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
