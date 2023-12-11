import { HttpError } from "../helpers/index.js";
import Contact from "../models/Contact.js"



const getAllContacts = async (req, res, next) => {
    try {
      const result = await Contact.find();
      res.json(result);
    } catch (error) {
      next(error);
    }
  };
  
  const getById = async (req, res, next) => {
    try {
      const { contactId } = req.params;
      const result = await Contact.findById(contactId);
      if (!result) {
        throw HttpError(404, `Not found`);
      }
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  const deleteContactId = async (req,res, next)=>{
       const {contactId} = req.params;
       const result = await Contact.findByIdAndDelete(contactId);
       if (!result) {
        throw HttpError(404, `Not found`);
      }
    res.json({
        message: "contact deleted"
    })
  }
  
  const add = async (req, res, next) => {
      const result = await Contact.create(req.body);
      res.status(201).json(result);
  };

  const updateContacts = async (req, res, next) => {
      const {contactId} = req.params;
      const result = await Contact.findByIdAndUpdate(contactId, req.body);
      if (!result) {
          throw HttpError(404, `Not found`);
        }
        res.json(result)
  };


  export default {
    getAllContacts,
    getById,
    add,
    deleteContactId,
    updateContacts
  };