import cardMlbb from "../models/cardMLBB.js";
import { createMlbbCard } from "../validator/createMlbbCardValidator.js";

//Admin routes only for declaration
// 1.Card Creation(Backend use only)
export const cardCreation = async function(req ,res) {
    try {
        const {error, value} = createMlbbCard.validate(req.body);
        
        if (error) {
            return res.status(400).json({
                message : "Error while retrieving the values",
                message : error.details[0].message
            });
        }

        const {
            title ,
             subtitle ,
             cardIndex,
             image ,
             teamSize,
             totalSquads,
             rounds,
             price,
             gamePrizeAmount,
             gameType,
             game

        } = value;

        const exists = await cardMlbb.findOne({cardIndex});

        if (exists) {
            return res.status(400).json({
                message : "The cardIndex has already registered!!", 
                success : false
            })
        };

        const newCard = new cardMlbb({
          title,
          subtitle,
          cardIndex,
          image,
          teamSize,
          totalSquads,
          rounds,
          price,
          gamePrizeAmount,
          gameType,
          game
        });
        
        await newCard.save();
        const cardData = newCard.toObject();
        
        return res.status(200).json({
            message : "Successfully created card", 
            success : true,
            cardDetails : [cardData]
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message : "Internal Server Error",
            status : false,
        });
    }
};

//Public route it will serve to users.
// 2. Send all the cards from the Mlbb category
export const getCardsMlbb = async function(req,res){
    try {
        const cardData = await cardMlbb.find();
        if (cardData) {
            return res.status(200).json({
                message : "Successfully fetched all cards for Mlbb",
                success : true,
                cards : cardData
            });
        }        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "Internal Server Error"
        })
    }

};