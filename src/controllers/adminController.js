import Admin from "../models/admin.js";
import Manager from "../models/manager.js";
import { createAdminValidator } from "../validator/createAdminValidator.js";
import { managerApproved } from "../utils/managerCredentials.js";
import { managerCredentialsEmail } from "../services/emailServices.js";

//1. Create Admin(Temporary code block it will be removed once the admin is created!!)
export const createAdmin = async (req,res) => {

    try {
        const {error , value} = createAdminValidator.validate(req.body);

        if (error) {
            return res.status(400).json({
                message : "Invalid credentials"
            });
        }

        const {adminName, adminEmail, adminPassword} = value;

        //Create Admin 
        const newAdmin = new Admin({
            adminName,
            adminEmail,
            adminPassword
        });
        //Save to the DB
        await newAdmin.save();

        return res.status(200).json({
            message : "Admin created successfully",
            success : true
        });

    } catch (error) {
        return res.status(500).json({
            message : "Internal server error",
            success : false
        });
    }
};

//2. Login Admin (Using email and password)
export const loginAdmin = async (req,res) => {
    try {
        const {email , password} = req.body;
        if(!email || !password){
            return res.status(400).json({
                message : "Invalid Credentials!!",
                success : false
            })
        };

        //Find the admin via using email
        const admin = await Admin.findOne({adminEmail:email});
        if (!admin) {
            return res.status(400).json({
                message : "Admin record not found, please check the credentials!!",
                success : false
            });
        };

        //Checking if the password matches!!
        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({
                message : "Password is invalid",
                success : false
            })
        };

        //Generate Tokens
        const accessToken = await admin.generateAccessToken();
        const refreshToken = await admin.generateRefreshToken();

        admin.accessToken = accessToken;
        admin.refreshToken = refreshToken;

        //Saving the JWT tokens
        await admin.save();

        const adminData = admin.toObject();
        delete adminData.adminPassword;

        //Loged in
        return res.status(200).json({
            success : true,
            message : "Login Successful",
            adminData
        });

    } catch (error) {
        return res.status(500).json({
            message : "Internal Server Error!!",
            success : false
        });
    }
};

// 3. Manager authorizing functions
export const managerApproving = async (req,res) => {
    try {

        const {email} = req.body;
        if (!email || typeof email !== "string") {
         return res.status(400).json({
            success : false,
            message : "valid email is required!!"
         })
        };

        const manager = await Manager.findOne({email});

        if(!manager){
            return res.status(400).json({
              success: false,
              message: "Invalid email!!",
            });
        }

        if (manager.authorized === false) {            
            manager.authorized = true;
        }
        const {MID, password} = await managerApproved();
        
        manager.MID = MID;
        manager.password = password;
        manager.tempPassExpiresAt = Date.now() + 24 * 60 * 60 * 1000;
        managerCredentialsEmail(email,MID,password); //Mailing service
        await manager.save();
        
        return res.status(202).json({
            success : true,
            message : "Manager approved successfully!!"
        });
    } 
    catch (error) {
        console.error("Error:",error);
        return res.status(500).json({
            success : false,
            message : error.message
        });
        
    };
};

// 4. Banning any manager

//5. Banning any admin (firstly the manager raise a query or complain about the admin and then the admin will review if admin found guilty he will be banned)

// 6. Manager record (UPI id edit.) also add UPI id attribute to the model

/*
 6. Coin features ({
  "packageId": "coins_100",
  "coins": 100,
  "price": 149,
  "currency": "INR",
  "active": true
})
*/

//Further features.....