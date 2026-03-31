import { createContext, useContext } from "react";
import { useAuth } from "./AuthContext";
import { useSocket } from "../hooks/useSocket";

const SocketContext = createContext({
  socket:        null,
  isConnected:   false,
  notifications: [],
  unreadCount:   0,
  clearNotif:    () => {},
});

export function SocketProvider({ children }) {
  const { isLoggedIn } = useAuth();
  const socketData     = useSocket(isLoggedIn);

  return (
    <SocketContext.Provider value={socketData}>
      {children}
    </SocketContext.Provider>
  );
}

// Safe — returns empty defaults if used outside provider
// instead of crashing with "must be inside SocketProvider"
export function useSocketContext() {
  return useContext(SocketContext);
}