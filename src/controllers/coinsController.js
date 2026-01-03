import Coins from "../models/coinsModel.js";
import User from "../models/userModel.js";
import Admin from "../models/admin.js";
import { registerCoinValidator, coinOrderValidator } from "../validator/coinValidator.js";

//1.CoinRegister (Admin Only).

export const coinRegister = async function (req,res) {
    //When the testing is done, we have to replace the email and password login method with the jwtTokens.
    const {error, value} = registerCoinValidator.validate(req.body);
    if (error) {
        console.log(error);
        return res.status(404).json({
            success : false,
            message : "Invalid Credentials!!"
        })
    };
    try {
         
        const {coinIndex, coinQuantity, discount, discountedPrice, price, currency, adminEmail, adminPassword} = value;
        
        const admin = await Admin.findOne({adminEmail : adminEmail});
        if (!admin) {
            return res.status(404).json({
                success : false,
                message : "Admin Credentials is invalid!!"
            })
        };

        const isMatch = await admin.comparePassword(adminPassword);

        if (!isMatch) {
            return res.status(404).json({
                success : false,
                message : "Wrong Password!!"
            })
        };

        const newCoin = new Coins({
          coinIndex,
          coinQuantity,
          discount,
          discountedPrice,
          price,
          currency,
        });
        await newCoin.save();

        return res.status(202).json({
            success : false,
            message : "NewCoin is generated!!",
            coinData : newCoin
        });

    } catch (error) {
    console.log(error);
    return res.status(500).json({
        success : false,
        message  : "Internal Server Error"
    });
    }
};

// 2. Fetch all registered coin.
export const fetchCoinDetails = async function (req,res) {
      try {

        const coins = await Coins.find();
        if (!coins) {
            return res.status(404).json({
            success : false,
            message : "Cannot find any coins!!"
            })
        };

        return res.status(500).json({
            success : true,
            message : "Fetched coins detail successfully!!",
            coinsData : coins
        });

      } catch (error) {
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "Internal Server Error!!"
        });
      }
};

// 3. Coin Payment & Coin Transfer into the user.

export const paymentAndCoinTransfer = async function (req,res) {
    const{error,value} = coinOrderValidator.validate(req.body);
    if (error) {
        return res.status(404).json({
            success : false,
            message : "Invalid Credentials!!"
        });
    };
    const {userId,orderId,coinId,token,amount,status} = value;
    try {
         const user = await User.findOne({userId : userId});
         if (!user) {
            return res.status(404).json({
                success : false,
                message : "User is not found!!"
            })
         };
          
    } catch (error) {
        
    }
};

// 4. Update coin (reducing price/discounted price).

// 5. Delete Coin (delete a coin using the index or coinIndex).