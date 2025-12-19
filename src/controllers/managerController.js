import Manager from "../models/manager.js";
import {createManagerValidator} from "../validator/createManagerValidator.js"
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// 1. Manager Applying and admin will approve
export const managerApplying = async (req,res) => {
    try {
 
        const {error, value} = createManagerValidator.validate(req.body);
        if (error) {
            res.status(400).json({
                message : "Error in retrieving values",
                message : error.details[0].message
            });
        };

        const {
            managerName,
            phone,
            email,
            gameType
        } = value;

        const existingManager = await Manager.findOne({ email });
        
        if (existingManager) {
            return res.status(400).json({
                message : "manager had already applied!!"
            })
        };

        const newManager = new Manager({
            managerName,
            phone,
            email,
            gameType
        });

        //Save to DB(managerId and password to be created and hashed in the DB and send to the manager)
        await newManager.save();
        
        //Return successfully applied.
        return res.status(200).json({
            message : "Applied successfully",
            credentials : newManager
        });

    } catch (error) {
        res.status(500).json({
            message : "Internal Server Error!!",
            errorCode : 101
        });
    };
  
};
