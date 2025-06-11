import express from "express";
import { ReadBranches } from "../../controllers/branch/readBranches";

const router = express.Router();

router.get(`/read-branches/:uid`, ReadBranches);
router.get(`/read-branches`, ReadBranches);

export default router;
