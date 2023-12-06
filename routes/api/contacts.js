import express from "express";
import contactsController from "../../controllers/contacts-controllers.js";
import { isEmptyBody } from "../../middlewares/index.js";

const router = express.Router();

router.get("/", contactsController.getAllContacts);

router.get("/:contactId", contactsController.getById);

router.post("/", isEmptyBody, contactsController.add);

router.delete("/:contactId", contactsController.deleteContactId);

router.put("/:contactId", isEmptyBody, contactsController.updateContacts);

export default router
