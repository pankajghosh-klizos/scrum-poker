import { Router } from "express";
import {
  createRoom,
  closeRoom,
  getRoom,
  joinRoom,
} from "../controllers/room.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route("/create").post(createRoom);
router.route("/:roomId/join").put(joinRoom);
router.route("/:roomId/leave").put(joinRoom);
router.route("/close").post(verifyJWT, closeRoom);
router.route("/get-room").get(verifyJWT, getRoom);

export default router;
