import Joi from "joi";
import contactsService from "../models/contacts.js";
import { HttpError } from "../helpers/index.js";

const contactAddSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
});

const contactUpdateShema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.string(),
});

const getAllContacts = async (req, res, next) => {
    try {
      const result = await contactsService.listContacts();
      res.json(result);
    } catch (error) {
      next(error);
    }
  };
  
  const getById = async (req, res, next) => {
    try {
      const { contactId } = req.params;
      const result = await contactsService.getContactById(contactId);
      if (!result) {
        throw HttpError(404, `Not found`);
      }
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  const deleteContactId = async (req,res, next)=>{
    try{
       const {contactId} = req.params;
       const result = await contactsService.removeContact(contactId);
       if (!result) {
        throw HttpError(404, `Not found`);
      }
    res.json({
        message: "contact deleted"
    })
    }
    catch(error){
      next(error);
    }
  }
  
  const add = async (req, res, next) => {
    try {
      const { error } = contactAddSchema.validate(req.body);
      if (error) {
          console.log('error', error)
        throw HttpError(400, error.message);
      }
      const result = await contactsService.addContact(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  const updateContacts = async (req, res, next) => {
    try {
      const { error } = contactUpdateShema.validate(req.body);
  
      if (error) {
          console.log('error', error)
        throw HttpError(400, error.message);
      }
      const {contactId} = req.params;
      const result = await contactsService.updateContact(contactId, req.body)
      if (!result) {
          throw HttpError(404, `Not found`);
        }
        res.json(result)
    } catch (error) {
      next(error);
    }
  };


  export default {
    getAllContacts,
    getById,
    add,
    deleteContactId,
    updateContacts
  };