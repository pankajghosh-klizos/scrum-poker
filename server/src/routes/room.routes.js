import { Router } from "express";
import {
  createRoom,
  closeRoom,
  getRoom,
  joinRoom,
  leaveRoom,
  selectCard,
  revealCard,
  voteAgain,
} from "../controllers/room.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route("/create").post(createRoom);
router.route("/:roomId/join").put(joinRoom);
router.route("/leave").delete(verifyJWT, leaveRoom);
router.route("/close").put(verifyJWT, closeRoom);
router.route("/get-room").get(verifyJWT, getRoom);
router.route("/select").put(verifyJWT, selectCard);
router.route("/reveal").put(verifyJWT, revealCard);
router.route("/vote-again").put(verifyJWT, voteAgain);

export default router;
