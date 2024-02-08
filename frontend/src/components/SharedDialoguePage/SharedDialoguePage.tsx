import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Spin } from "antd";
import { format } from "date-fns";

import { Dialogue } from "../../services/fetchDialogueById";
import { fetchSharedDialogue } from "../../services/sharedDialogueService";

const SharedDialoguePage = () => {
  const { shareIdentifier } = useParams<{ shareIdentifier: string }>();
  const [dialogue, setDialogue] = useState<Dialogue | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchDialogue = async () => {
      if (typeof shareIdentifier === "string") {
        try {
          const response = await fetchSharedDialogue(shareIdentifier);
          setDialogue(response);
        } catch (err) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("An unexpected error occurred");
          }
        } finally {
          setLoading(false);
        }
      } else {
        setError("Invalid dialogue identifier");
        setLoading(false);
      }
    };

    fetchDialogue();
  }, [shareIdentifier]);

  if (loading) return <Spin size="large" />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {dialogue ? (
        <div>
          <h2>Dialogue from {format(new Date(dialogue.createdAt), "PPpp")}</h2>{" "}
          {dialogue.messages.map((message, index) => (
            <div key={index}>
              <strong>{message.sender}: </strong>
              <span>{message.message}</span>
            </div>
          ))}
        </div>
      ) : (
        <div>No dialogue found</div>
      )}
    </div>
  );
};

export default SharedDialoguePage;
