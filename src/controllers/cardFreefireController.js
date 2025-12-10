//Admin routes only
import cardFF from "../models/cardFreefire.js";
import { createFreefireCard } from "../validator/createFreefireCardValidator.js";

// 1.Card Creation(Backend use only)
export const cardCreation = async function(req ,res) {
    try {
        const {error, value} = createFreefireCard.validate(req.body);
        
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
             minAge,
             teamSize,
             totalSquads,
             rounds,
             prize,
             gamePrizeAmount,
             gameType,
             game

        } = value;

        const exists = await cardFF.findOne({cardIndex});

        if (exists) {
            return res.status(400).json({
                message : "The cardIndex has already registered!!", 
                success : false
            })
        };

        const newCard = new cardFF({
          title,
          subtitle,
          cardIndex,
          image,
          minAge,
          teamSize,
          totalSquads,
          rounds,
          prize,
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

// 2. Send all the cards from the freeFire category
export const getCardsFreeFire = async function(req,res){
    try {
        const cardData = await cardFF.find();
        if (cardData) {
            return res.status(200).json({
                message : "Successfully fetched all cards for freeFire",
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