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
}

/*
  2. Manager Login (using MID and password)
  Demo Function, have to change before deployment
*/
    export const managerLogin = async(req,res) =>{
        try {
        const {error,value} = req.body;
        if(error){
            return res.status(400).json({
                success : false,
                message : "Invalid Credentials!!"
            });
        };

        const{MID, password} = value;

        const manager = await Manager.findOne({MID});
        if (!manager) {
            return res.status(400).json({
                success : false,
                message : "can't find manager, enter valid Manager ID"
            });
        };
        
        const isMatch = await Manager.findOne({password});
        if (!isMatch) {
            return res.status(400).json({
                success : false,
                message : "Invalid password or MID"
            });
         };

         return res.status(200).json({
            success : true,
            message : "Loged in successfully",
                managerName : manager.managerName,
                MID : manager.MID,
                sessionActive : manager.sessionActive,
                gameType : manager.gameType
         });

      } 
      catch (error) {
      return res.status(500).json({
        success : false,
        message : "Internal Server Error"
      });  
     };

    }; 
