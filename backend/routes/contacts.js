import express from "express";
import * as contactsCtrl from "../controllers/contactsController.js";

const router = express.Router();

router.get("/", contactsCtrl.listContacts);
router.post("/", contactsCtrl.createContact);
router.delete("/:id", contactsCtrl.deleteContact);

export default router;
