import Admin from "../models/admin.js";
import Manager from "../models/manager.js";
import { createAdminValidator } from "../validator/createAdminValidator.js";
import { managerApproved } from "../services/managerServices.js";

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
        const admin = await Admin.findOne({email});
        if (!email) {
            return res.status(400).json({
                message : "Admin record not found, please check the credentials!!",
                success : false
            });
        }
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

        user.accessToken = accessToken;
        user.refreshToken = refreshToken;

        //Saving the JWT tokens
        await user.save();

        const adminData = admin.toObject;
        delete adminData.adminPassword;

        //Loged in
        return res.status(200).json({
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
        const {error, value} = req.body;
        if (error) {
            return res.status(400).json({
                success : false,
                message : "Invalid Credentials"
            });
        };

        const {email} = value;
        if (!email) {
         return res.status(400).json({
            success : false,
            message : "email is required!!"
         })
        };

        const manager = await Manager.findOne(email);
        if(!manager){
            return res.status(400).json({
              success: false,
              message: "Invalid email!!",
            });
        }

        manager.authorized = true;
        const {managerId, managerPassword} = managerApproved();
        
        manager.MID = managerId;
        manager.managerPassword = managerPassword;
        manager.save();
    
    } 
    catch (error) {
        return res.status(500).json({
            success : false,
            message : "Internal Server error!!"
        })
    };
};

// 4. Banning any manager

//5. Banning any user (firstly the manager raise a query or complain about the user and then the admin will review if user found guilty he will be banned)

//Further features.....