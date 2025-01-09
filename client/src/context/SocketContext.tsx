import localforage from "localforage";
import socketio from "socket.io-client";
import {
  createContext,
  useEffect,
  useState,
  FC,
  ReactNode,
  useMemo,
} from "react";

interface SocketContextType {
  socket: ReturnType<typeof socketio> | null;
  error: string | null;
  isConnected: boolean;
}

const getSocket = async (): Promise<ReturnType<typeof socketio>> => {
  try {
    const token = await localforage.getItem<string>("accessToken");

    return socketio(import.meta.env.VITE_SOCKET_URL, {
      auth: { token },
      transports: ["websocket"],
    });
  } catch (error) {
    throw new Error("Error getting the socket connection or token");
  }
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  error: null,
  isConnected: false,
});

const SocketProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<ReturnType<typeof socketio> | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    const initializeSocket = async () => {
      try {
        const newSocket = await getSocket();

        // Set socket state
        setSocket(newSocket);
        setError(null);

        // Handle socket events
        newSocket.on("connect", () => {
          setIsConnected(true);
          console.log("Socket connected");
        });

        newSocket.on("disconnect", () => {
          setIsConnected(false);
          console.log("Socket disconnected");
        });

        newSocket.on("connect_error", (err) => {
          setError(`Socket connection error: ${err.message}`);
          console.error("Socket connection error:", err);
        });

        newSocket.on("connect_timeout", () => {
          setError("Socket connection timeout.");
          console.warn("Socket connection timeout");
        });
      } catch (err) {
        setError("Failed to initialize socket.");
        console.error("Socket initialization error:", err);
      }
    };

    initializeSocket();

    // Cleanup socket connection on unmount
    return () => {
      if (socket) {
        socket.disconnect();
        console.log("Socket disconnected");
      }
    };
  }, []);

  // Use useMemo to memoize the context value and avoid unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      socket,
      error,
      isConnected,
    }),
    [socket, error, isConnected] // Only re-memoize when one of these values changes
  );

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};

export { SocketProvider, SocketContext };
