import Manager from "../models/manager.js";
import {createManagerValidator} from "../validator/createManagerValidator.js"
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

        const{MID, managerPassword} = value;
        if (!MID || !managerPassword) {
          return res.status(400).json({
          message: "ManagerID and Password required!!",
      });
    };

        //Find manager by MID
        const manager = await Manager.findOne({MID});
        if (!manager) {
            return res.status(400).json({
                success : false,
                message : "can't find manager, enter valid Manager ID"
            });
        };

    //Compare entered password!!
    const isMatch = await manager.comparePassword(managerPassword);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials. Please check your password.",
      });
    };

    //Check if manager is banned
    if (manager.banned === true) {
        return res.status(404).json({
            success : false,
            message : "Your account is banned, reach our support for further process!!"
        });
    };
    
    const accessToken = await manager.generateAccessToken();
    const refreshToken = await manager.accessToken();

    manager.accessToken = accessToken;
    manager.refreshToken = refreshToken;

    await manager.save();

    return res.status(200).json({
        success : true,
        message : "Loged in successfully",
        managerName : manager.managerName,
        MID : manager.MID,
        sessionActive : managersessionActive,
        gameType : manager.gameType,
        accessToken : manager.accessToken,
        refreshToken : manager.refreshToken,
        banned : manager.banned
    });

      } 
      catch (error) {
      return res.status(500).json({
        success : false,
        message : "Internal Server Error"
      });  
     };

    }; 
