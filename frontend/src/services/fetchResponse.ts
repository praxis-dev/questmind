// fetchResponse.ts (frontend service)

import { EventSourcePolyfill } from "event-source-polyfill";

const endpoint = "/respond/respond";
const apiUrl = `${process.env.REACT_APP_API_URL}${endpoint}`;

export const fetchResponse = (
  question: string,
  dialogueId: string | null,
  onChunkReceived: (chunk: string) => void,
  onStreamClosed: () => void,
  onNewDialogueIdReceived: (newDialogueId: string) => void
) => {
  if (!apiUrl) {
    throw new Error("REACT_APP_API_URL environment variable not set");
  }

  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No authentication token found.");
  }

  const urlWithParams = `${apiUrl}?question=${encodeURIComponent(
    question
  )}&dialogueId=${dialogueId || ""}`;

  const eventSource = new EventSourcePolyfill(urlWithParams, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  eventSource.onmessage = function (this: EventSource, ev) {
    console.log("Received event:", ev);

    // Directly check if 'data' property exists instead of using instanceof MessageEvent
    if ("data" in ev && typeof ev.data === "string") {
      console.log("Event data:", ev.data);

      if (ev.data.startsWith("id: ")) {
        const newDialogueId = ev.data.substring(4).trim();
        onNewDialogueIdReceived(newDialogueId);
      } else {
        onChunkReceived(ev.data);
      }
    } else {
      console.error("Unexpected event format or data type:", ev);
    }
  };

  eventSource.onerror = function (this: EventSource, ev) {
    console.error("EventSource failed:", ev);

    if (ev instanceof ErrorEvent) {
      console.error("Error message:", ev.message);
      console.error("Filename:", ev.filename);
      console.error("Line number:", ev.lineno);
      console.error("Column number:", ev.colno);
      console.error("Error object:", ev.error);
    }

    eventSource.close();
    onStreamClosed();
  };

  return () => {
    eventSource.close();
  };
};
