import express from "express";
import { ReadUsers } from "../../controllers/users/readUsers";
import { AddUsers } from "../../controllers/users/addUser";
import { UpdateUsers } from "../../controllers/users/updateUser";
import { DeleteUsers } from "../../controllers/users/deleteUser";
import { SeedUsers } from "../../controllers/users/seedUser";

const router = express.Router();

router.get("/read-users", ReadUsers);
router.post("/add-user", AddUsers);
router.get("/seed-user", SeedUsers);
router.put("/update-user/:uid", UpdateUsers);
router.delete("/delete-user/:uid", DeleteUsers);

export default router;
