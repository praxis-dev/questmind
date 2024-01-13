// fetchResponse.ts (frontend service)

import { EventSourcePolyfill } from "event-source-polyfill";

const endpoint = "/respond/respond";
const apiUrl = `${process.env.REACT_APP_API_URL}${endpoint}`;

export const fetchResponse = (
  question: string,
  dialogueId: string | null,
  onChunkReceived: (chunk: string) => void,
  onStreamClosed: () => void,
  onNewDialogueIdReceived: (newDialogueId: string) => void // New parameter
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

  // @ts-ignore
  eventSource.onmessage = (ev: MessageEvent) => {
    console.log("Received data:", ev.data); // Log all received data

    if (ev.data.startsWith("id: ")) {
      const newDialogueId = ev.data.substring(4).trim();
      onNewDialogueIdReceived(newDialogueId); // Call the new callback with the new dialogueId
    } else {
      onChunkReceived(ev.data);
    }
  };

  // @ts-ignore
  eventSource.onerror = (ev: Event) => {
    console.error("EventSource failed:", ev);
    if (ev instanceof ErrorEvent) {
      console.error("Error message:", ev.message);
    }
    eventSource.close();
    onStreamClosed();
  };

  return () => {
    eventSource.close();
  };
};
