import mongoose from 'mongoose';
import { ContactSchema } from '../models/crmModel';

const Redis = require('../Redis/redis');
let redisObject = new Redis();
const Contact = mongoose.model('Contact', ContactSchema);

export const addnewContact = (req, res) => {
    let newContact = new Contact(req.body);

    newContact.save((err, contact) => {
        if (err) {
            res.send(err);
        }
        redisObject.set(contact._id,JSON.stringify(contact))
        res.json(contact);
    });
}

export const getContacts = (req, res) => {
    Contact.find({}, (err, contact) => {
        if (err) {
            res.send(err);
        }
        res.json(contact);
    });
}

export const getContactWithID = async (req, res) => {
    let KeyExist = await redisObject.get(req.params.contactID);
        if (KeyExist) {
            console.log('Fetching Data from cache');
            let data = await redisObject.get(req.params.contactID)
                .catch((err) => {
                    console.log(err);
                });
            res.json(JSON.parse(data));
        } else {
            console.log('Fetching Data from db');
            Contact.findById(req.params.contactID, (err, contact) => {
                if (err) {
                    res.send(err);
                }
                res.json(contact);
            });
        }


}

export const updateContact = (req, res) => {
    Contact.findOneAndUpdate({ _id: req.params.contactID}, req.body, { new: true, useFindAndModify: false }, (err, contact) => {
        if (err) {
            res.send(err);
        }
        res.json(contact);
    });
}

export const deleteContact = (req, res) => {
    Contact.remove({ _id: req.params.contactID}, (err) => {
        if (err) {
            res.send(err);
        }
        res.json({ message: 'successfuly deleted contact'});
    });
}
