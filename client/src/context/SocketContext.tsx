// import { useLocation } from "react-router";
// import localforage from "localforage";
// import io from "socket.io-client";
// import {
//   createContext,
//   useEffect,
//   useState,
//   FC,
//   ReactNode,
//   useMemo,
// } from "react";

// import { SocketContextType } from "../interfaces";

// const getSocket = async (): Promise<ReturnType<typeof io>> => {
//   try {
//     const token = await localforage.getItem<string>("accessToken");

//     return io(import.meta.env.VITE_SOCKET_URL, {
//       auth: { token },
//       transports: ["websocket"],
//     });
//   } catch (error) {
//     throw new Error("Error getting the socket connection or token");
//   }
// };

// const SocketContext = createContext<SocketContextType>({
//   socket: null,
//   error: null,
//   isConnected: false,
// });

// const SocketProvider: FC<{ children: ReactNode }> = ({ children }) => {
//   const location = useLocation();
//   const [socket, setSocket] = useState<ReturnType<typeof io> | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [isConnected, setIsConnected] = useState<boolean>(false);

//   useEffect(() => {
//     if (location.pathname === "/play") {
//       const initializeSocket = async () => {
//         try {
//           const newSocket = await getSocket();

//           // Set socket state
//           setSocket(newSocket);
//           setError(null);

//           // Handle socket events
//           newSocket.on("connect", () => {
//             setIsConnected(true);
//             console.log("Socket connected");
//           });

//           newSocket.on("disconnect", () => {
//             setIsConnected(false);
//             console.log("Socket disconnected");
//           });

//           newSocket.on("connect_error", (err) => {
//             setError(`Socket connection error: ${err.message}`);
//             console.error("Socket connection error:", err);
//           });

//           newSocket.on("connect_timeout", () => {
//             setError("Socket connection timeout.");
//             console.warn("Socket connection timeout");
//           });
//         } catch (err) {
//           setError("Failed to initialize socket.");
//           console.error("Socket initialization error:", err);
//         }
//       };

//       initializeSocket();
//     }

//     // Cleanup socket connection
//     return () => {
//       if (socket) {
//         socket.disconnect();
//         setSocket(null);
//         console.log("Socket disconnected");
//       }
//     };
//   }, [location.pathname]);

//   // Memoize the context value to avoid unnecessary re-renders
//   const contextValue = useMemo(
//     () => ({
//       socket,
//       error,
//       isConnected,
//     }),
//     [socket, error, isConnected]
//   );

//   return (
//     <SocketContext.Provider value={contextValue}>
//       {children}
//     </SocketContext.Provider>
//   );
// };

// export { SocketProvider, SocketContext };
