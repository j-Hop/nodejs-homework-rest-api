import { HttpError } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";
import Contact from "../models/Contact.js";

const getAllContacts = async (req, res) => {
  const {_id: owner} = req.user;
  const {page = 1, limit = 10, ...filterParams} = req.query;
    const skip = (page - 1) * limit;
    const filter = {owner, ...filterParams};

  const contacts = await Contact.find(filter, "-createdAt -updatedAt", {skip, limit}).populate("owner", "username email");
  const total = await Contact.countDocuments(filter)
  res.json({
    contacts, 
    total,
  });
};

const getById = async (req, res) => {
  const { contactId } = req.params;
  const {_id: owner} = req.user;
  const oneContact = await Contact.findOne({_id: id, owner});
  if (!oneContact) {
    throw HttpError(404, `Contact with id=${contactId} not found`);
  }
  res.json(oneContact);
};

const add = async (req, res) => {
  const {_id: owner} = req.user;
  const result = await Contact.create({...req.body, owner});
  res.status(201).json(result);
};

const updateById = async (req, res) => {
  const { contactId } = req.params;
  const {_id: owner} = req.user;
  const result = await Contact.findOneAndUpdate({_id: contactId, owner}, req.body);
  if (!result) {
    throw HttpError(404, `Contact with id=${contactId} not found`);
  }
  res.json(result);
};

const deleteById = async (req, res) => {
    const { contactId } = req.params;
    const {_id: owner} = req.user;
    const result = await Contact.ffindOneAndDelete({_id: contactId, owner});;
    if (!result) {
      throw HttpError(404, `Contact with id=${id} not found`);
    }
    res.json({
      message: "Contact deleted",
    });
};

export default {
  getAllContacts: ctrlWrapper(getAllContacts),
  getById: ctrlWrapper(getById),
  add: ctrlWrapper(add),
  updateById: ctrlWrapper(updateById),
  deleteById: ctrlWrapper(deleteById),
};