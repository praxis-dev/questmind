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
    if ("data" in ev && typeof ev.data === "string") {
      if (ev.data.startsWith("id: ")) {
        const newDialogueId = ev.data.substring(4).trim();
        onNewDialogueIdReceived(newDialogueId);
      } else {
        onChunkReceived(ev.data);
      }
    } else {
      // console.error("Unexpected event format or data type:", ev);
    }
  };

  eventSource.onerror = function (this: EventSource, ev) {
    this.close();
    onStreamClosed();
  };

  return () => {
    eventSource.close();
  };
};
