import { Router } from "express";

import {
  createEventController,
  getEventsController,
} from "../controllers/eventController";

const router = Router();

router.get("/", getEventsController);
router.post("/", createEventController);

export default router;
