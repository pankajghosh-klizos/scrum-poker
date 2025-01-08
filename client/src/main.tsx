import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import { Provider } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import store from "./store/store.ts";
import { ProtectedRoute } from "./components/index.ts";
import { Root, Home, NewGame, PlayGame, JoinGame } from "./pages/index.ts";
import "./index.css";
import { SocketProvider } from "./context/SocketContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <Routes>
          <Route element={<Root />}>
            <Route index element={<Home />} />
            <Route path="new-game" element={<NewGame />} />
            <Route path="join/:roomId" element={<JoinGame />} />

            <Route
              path="play"
              element={
                <ProtectedRoute>
                  <SocketProvider>
                    <PlayGame />
                  </SocketProvider>
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </Provider>
    </BrowserRouter>
  </StrictMode>
);
