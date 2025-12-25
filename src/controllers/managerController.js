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
};

//Session Management feature, I had sessionActive attribute on the DB, I have to turn it true when the user logged in into any device and if he tries to login again on the other device, and he was also logged in into another device so the controller will check the sessionActive, and if it is true he will be seen a popup like you're logged in another device, or he will get a warning like you will be logged out of the previous device , and then we should let the login flow continue, it will refresh the access and refresh token.
//2. Manager Login (using MID and password)
    export const managerLogin = async(req,res) =>{
        try {
        const{MID, password} = req.body;
        if (!MID || !password) {
          return res.status(400).json({
          message: "MID and Password required!!",
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

        //Validate the user is authorized or not
        if (manager.authorized === false) {
            return res.status(404).json({
                success : false,
                message : "Manager is not authorized!!"
            })
        };

        //If the manager haven't changed his password.
        if (manager.passwordChanged === false) {            
            //Checks the tempPassword is valid or not
            if (Date.now() >=manager.tempPassExpiresAt) {
               return res.status(404).json({
                success : false,
                message : "Temporary password is expired, contact admin for further support"
               })
            };
        };

    //Compare entered password!!
    const isMatch = await manager.comparePassword(password);
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
    const refreshToken = await manager.generateRefreshToken();

    manager.accessToken = accessToken;
    manager.refreshToken = refreshToken;
    manager.sessionActive = true;

    await manager.save();

    if (manager.tempPassExpiresAt === null) {        
        return res.status(200).json({
            success : true,
            message : "Loged in successfully",
            managerName : manager.managerName,
            MID : manager.MID,
            sessionActive : manager.sessionActive,
            gameType : manager.gameType,
            accessToken : manager.accessToken,
            refreshToken : manager.refreshToken,
            banned : manager.banned
        });
    };

    if (manager.tempPassExpiresAt) {        
        return res.status(200).json({
            success : true,
            message : "Loged in successfully, please change your temporary password!!",
            managerName : manager.managerName,
            MID : manager.MID,
            sessionActive : manager.sessionActive,
            gameType : manager.gameType,
            accessToken : manager.accessToken,
            refreshToken : manager.refreshToken,
            banned : manager.banned
        });
    };

    } 
      catch (error) {
        console.log(error);
      return res.status(500).json({
        success : false,
        message : "Internal server error!!"
      });  
     };
}; 

// 3. Manager Reset password(Temp password change)
export const managerPasswordReset = async function(req,res){
    try {
        const {MID,password,newPassword} = req.body;
        if ((!MID, !password, !newPassword)) {
            return res.status(404).json({
                success : false,
                message : "Invalid credentials!!"
            });
        };

        const manager = await Manager.findOne({MID});

        if (!manager) {
            return res.status(404).json({
                success : false,
                message : "Manager is not found!!"
            })
        };

        const isMatch = await manager.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
              message: "Invalid credentials. Please check your password.",
            });
        };

        //Saving new password
        manager.password = newPassword;
        manager.passwordChanged = true;
        manager.tempPassExpiresAt = null;
        await manager.save();

        return res.status(202).json({
          success: true,
          message: "Password Changed successfully!!",
        });
        
    } catch (error) {
     console.log(error);
     return res.status(500).json({
        success : false,
        message : "Internal Server Error!!"
     });        
    }



};
