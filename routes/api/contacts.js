import express from "express";

import contactsController from "../../controllers/contacts-controllers.js";

import { authenticate, isEmptyBody, isValidId } from "../../middlewares/index.js";

import { validateBody } from "../../decorators/index.js";

import {
  contactUpdateShema,
  contactFavoriteSchema,
  contactAddSchema,
} from "../../models/Contact.js";

const router = express.Router();

router.use(authenticate)


router.get("/", contactsController.getAllContacts);

router.get("/:contactId", isValidId, contactsController.getById);

router.post(
  "/",
  isEmptyBody.isEmptyBody,
  validateBody(contactAddSchema),
  contactsController.add
);

router.delete("/:contactId", isValidId, contactsController.deleteById);

router.put(
  "/:contactId",
  isEmptyBody.isEmptyBody,
  isValidId,
  validateBody(contactUpdateShema),
  contactsController.updateById
);

router.patch(
  "/:contactId/favorite",
  isEmptyBody.isEmptyBodyFavorite,
  isValidId,
  validateBody(contactFavoriteSchema),
  contactsController.updateById
);

export default router;