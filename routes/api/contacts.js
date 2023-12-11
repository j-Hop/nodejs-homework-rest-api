import express from "express";
import contactsController from "../../controllers/contacts-controllers.js";
import { isEmptyBody, isValidId} from "../../middlewares/index.js";
import {validateBody} from "../../decorators/index.js"
import { contactAddSchema, contactUpdateShema, contactFavoriteSchema } from "../../models/Contact.js";

const router = express.Router();

router.get("/", contactsController.getAllContacts);

router.get("/:contactId", isValidId, contactsController.getById);

router.post("/", isEmptyBody.isEmptyBody, validateBody(contactAddSchema),contactsController.add);

router.delete("/:contactId", isValidId, contactsController.deleteContactId);

router.put("/:contactId",isValidId, isEmptyBody.isEmptyBody,validateBody(contactUpdateShema) , contactsController.updateContacts);

router.patch("/:contactId/favorite", isValidId, isEmptyBody.isEmptyBodyFavorite, validateBody(contactFavoriteSchema), contactsController.updateContacts);

export default router
