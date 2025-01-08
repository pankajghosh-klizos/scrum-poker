import { Router } from "express";
import {
  createRoom,
  closeRoom,
  getRoom,
  joinRoom,
  leaveRoom,
} from "../controllers/room.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route("/create").post(createRoom);
router.route("/:roomId/join").put(joinRoom);
router.route("/leave").delete(verifyJWT, leaveRoom);
router.route("/close").put(verifyJWT, closeRoom);
router.route("/get-room").get(verifyJWT, getRoom);

export default router;
