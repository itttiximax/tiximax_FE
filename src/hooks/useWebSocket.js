// src/hooks/useWebSocket.js
import { useEffect, useRef, useState, useCallback } from "react";
import WebSocketService from "../Services/WebSocketService";

export const useWebSocket = (topic) => {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const subscriptionRef = useRef(null);
  const isConnectingRef = useRef(false);

  const handleMessage = useCallback((data) => {
    console.log("📩 Message received in hook:", data);
    setMessages((prev) => [data, ...prev]);
  }, []);

  useEffect(() => {
    if (isConnectingRef.current) return;
    isConnectingRef.current = true;

    WebSocketService.connect()
      .then(() => {
        console.log("✅ Hook: WebSocket connected");
        setIsConnected(true);

        if (topic) {
          subscriptionRef.current = WebSocketService.subscribe(
            topic,
            handleMessage
          );
        }
      })
      .catch((error) => {
        console.error("❌ Hook: Failed to connect:", error);
        setIsConnected(false);
      })
      .finally(() => {
        isConnectingRef.current = false;
      });

    return () => {
      if (topic && subscriptionRef.current) {
        WebSocketService.unsubscribe(topic);
      }
    };
  }, [topic, handleMessage]);

  return {
    messages,
    isConnected,
    sendMessage: WebSocketService.send.bind(WebSocketService),
  };
};
