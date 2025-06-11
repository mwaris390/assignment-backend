import express from "express";
import { Auth } from "../../controllers/auth/authUser";

const router = express.Router();

router.post("/auth", Auth);

export default router;
