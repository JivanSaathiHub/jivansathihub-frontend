import { useEffect, useRef, useState, useCallback } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = process.env.REACT_APP_API_URL
  ? process.env.REACT_APP_API_URL.replace("/api", "")
  : "http://localhost:5000";

/**
 * useSocket — connects to Socket.io when user is logged in
 *
 * Returns:
 *   socket        — the socket instance (or null)
 *   notifications — array of unread notification objects
 *   clearNotif    — clear all notifications
 *   isConnected   — boolean
 */
export function useSocket(isLoggedIn) {
  const socketRef                         = useRef(null);
  const [isConnected,   setIsConnected]   = useState(false);
  const [notifications, setNotifications] = useState([]);

  const addNotif = useCallback((notif) => {
    setNotifications(prev => [notif, ...prev].slice(0, 50)); // keep last 50
  }, []);

  const clearNotif = useCallback(() => {
    setNotifications([]);
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      // Disconnect if user logs out
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
      return;
    }

    // Get token from cookie — the server reads it from the cookie header
    // Socket.io will send cookies automatically with withCredentials: true
    const socket = io(SOCKET_URL, {
      withCredentials: true,   // sends HTTPOnly cookie automatically
      transports:      ["websocket", "polling"],
      reconnection:    true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
      console.log("🔌 Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
      console.log("🔌 Socket disconnected");
    });

    socket.on("connect_error", (err) => {
      console.warn("Socket connect error:", err.message);
      setIsConnected(false);
    });

    // ── Interest notifications ─────────────────────────────────
    socket.on("new_interest", (data) => {
      addNotif({
        id:      Date.now(),
        type:    "new_interest",
        title:   "New Interest! 💌",
        body:    `${data.sender?.fullName} sent you an interest`,
        data,
        time:    new Date(),
        read:    false,
      });
    });

    socket.on("interest_accepted", (data) => {
      addNotif({
        id:      Date.now(),
        type:    "interest_accepted",
        title:   "Interest Accepted! 🎉",
        body:    `${data.acceptedBy?.fullName} accepted your interest`,
        data,
        time:    new Date(),
        read:    false,
      });
    });

    socket.on("interest_declined", (data) => {
      addNotif({
        id:      Date.now(),
        type:    "interest_declined",
        title:   "Interest Update",
        body:    `${data.declinedBy?.fullName} has responded to your interest`,
        data,
        time:    new Date(),
        read:    false,
      });
    });

    // ── Message notifications ──────────────────────────────────
    socket.on("new_message", (data) => {
      addNotif({
        id:      Date.now(),
        type:    "new_message",
        title:   "New Message 💬",
        body:    `${data.senderName}: ${data.text?.slice(0, 40)}`,
        data,
        time:    new Date(),
        read:    false,
      });
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [isLoggedIn, addNotif]);

  return {
    socket:       socketRef.current,
    isConnected,
    notifications,
    clearNotif,
    unreadCount:  notifications.filter(n => !n.read).length,
  };
}