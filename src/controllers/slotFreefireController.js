//This file is containing slots logic for user and manager!!
import Slot from "../models/slotsFreefire.js";
import Payment from "../models/payment.js";
import createTeamff from "../validator/createTeamFF.js";
import teamRegister from "../models/teamFreefire.js";
import User from "../models/userModel.js"
import teamFreefire from "../models/teamFreefire.js";
import Manager from "../models/manager.js";

//Firstly we ask the user the userId and then he will make the payment, We will let him in the slot and wait for his payment,if he don't make payment in 2mins we will erase his record so others can come in the slot.

//1. User team input for the slot. (If a user only registered and haven't done the payment, his record will get vanished!!)

//Imp:- I have to add a thing here, which is when the user sends the paymentConfirming thing it will happen when the user registers his team,  we will check if the DB is containing any live slot user will recieve notification, that you're already in a slot.
export const registerTeamForFreeFire = async function (req,res) {
    try {
      
        const {error,value} = createTeamff.validate(req.body);

        if (error) {
            console.log(error);
            return res.status(404).json({
                success : false,
                message : "Error in retrieving values!!"
            });
        };

        const {
            userId,
            phone,
            yourUID,
            teamName,
            player1,
            player2,
            player3,
            player4
        } = value;

        const user = await User.findOne({userId : userId});

        if (!user) {
            return res.status(404).json({
                success : false,
                message : "Cannot find the user, Invalid UserID!!"
            })
        };
        //I have to check if the user is having a slot enrolled currently, if enrolled return and show him the message that you're enrolled into a slot.
        
        const newTeam = new teamRegister({
            userId : user._id,
            phone,
            yourUID,
            teamName,
            player1,
            player2,
            player3,
            player4,
            
            
        });
        newTeam.expiresAt = new Date(Date.now() + 10 * 60 * 1000);
        await newTeam.save();
        
        return res.status(202).json({
            success : true,
            message : "Team registered successfully!!",
            teamInfo : newTeam
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "Internal Server Error!!"
        })
    };
};

//2. User gets into a slot(after payment) (If the payment is done, change the paymentSuccess to true, and also change the expiresAt to null, so the document won't get delete!!);
//Payment model will be created but the slot is not created and aloted till now, they will be assigned to the payment and the slot will be created and the team will be registered to the slot as per the avaialability.

//Slot Alotment = When the user had done the payment, we have to alot them slots, the slots are aloted to the user like if any slot needs any team they will be transfered to that slot, if all slots are full, create one and then add others
//We have to filter the teamId by the userId and we have to check the slot also if the slot is done or ongoing the user cannot register it again.

//Note :- We will also need the cardId to match that the user is paying for the right slot.
export const paymentConfirming_SlotMakingForUser = async function (req,res){
    const {teamId,userId, amountPaid, currency, gameType} = req.body;
    if (!userId || !amountPaid || !currency ||  !teamId || !gameType) {
        return res.status(404).json({
            success : false,
            message : "userId, amountPaid, currency,teamId is needed!!"
        });
    };

    try {
    const user = await User.findOne({userId : userId});
    if (!user) {
        return res.status(404).json({
            success : false,
            message : "cannot find user!!"
        })
    };
    const team = await teamFreefire.findOne({teamId : teamId});

    //Payment Slot creation
    const newPayment = new Payment ({
        userId : user._id,
        amountPaid : amountPaid,
        currency : currency,
    });
    // await newPayment.save();

    //Assigning user to the slot!!
    const newSlot = await Slot.findOneAndUpdate({
        matchStatus: "pending",
        teamA: { $ne: null }, //notEquals
        teamB: { $eq: null }, //Equals
        },
        {
            $set : {
                teamB : team._id,
            }
        },
        {new : true} //return the updated document
    );

        if (newSlot) {
            newPayment.slotID = newSlot._id;
            await newPayment.save();
            team.expiresAt = null;
            team.paymentSuccess = true;
            await team.save();  

            await teamFreefire.findOneAndUpdate({
                paymentSuccess : true,
            });

            return res.status(202).json({
                success: true,
                message: "This user is registered to the slot, in TeamB",
                slotData: newSlot,
            });
        };
        if (!newSlot) {
            const generateSlot = new Slot({
                gameType : "ff",
                teamA : team._id,
            });
            await generateSlot.save();

            newPayment.slotID = generateSlot._id;
            team.expiresAt = null;
            team.paymentSuccess = true;
            await team.save();

            await newPayment.save();
            await teamFreefire.findOneAndUpdate({
                paymentSuccess : true,
            })

            return res.status(202).json({
              success: true,
              message: "This user is registered to the slot, in TeamA",
              slotData: generateSlot,
            });
        };
    }
    catch (error){
    console.log(error);
    return res.status(500).json({
    success : false,
    message : "Internal Server Error!!"
    });  
    };
};

//4. Slot for manager to join(only those slots in which the managers are not assigned!!)
export const managerSlotShowing = async function (req,res){
    try {
      
        const slot = await Slot.find({manager : {$eq : null}});

        if (!slot) {
            return res.status(202).json({
                success : true,
                message : "No slot is available now!!"
            });
        }

        return res.status(200).json({
            success : true,
            message : "Fetched all the available slots!!",
            slots : slot
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "Internal Server Error!!"
        })
    };
} ;

//5. Assigning manager to the available slots
export const managerSlotAssigning = async function (req,res) {
    const {slotId, managerId, roomId,roomPassword} = req.body;
    if(!slotId || !managerId ||  !roomPassword || !roomId) return res.status(404).json({
        success : false,
        message : "slotId , managerId , roomPassword, roomId is needed!!"
    });

    try {
    const slot = await Slot.findOne({
        slotId : slotId,
        manager : {$eq : null}
    });

    const manager = await Manager.findOne({MID : managerId});
    if (!manager) {
        return res.status(404).json({
            success : false,
            message : "Cannot find manager!!"
        });
    };

    if (!slot) {
        return res.status(404).json({
            success : false,
            message : "Another manager joined, unavailable slot find and join new one!!"
        })
    };

    slot.manager = manager._id;
    slot.roomId = roomId;
    slot.roomPassword = roomPassword; 
    
    if (slot.teamA != null && slot.teamB != null) {        
        slot.matchStatus = "ready";   
    }
    await slot.save();

    return res.status(202).json({
        success : true,
        message : "Manager joined the slot successfully, start the match within 5 minutes!!"
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
        success : false,
        message : "Internal Server Error!!"
    })
  };
};

//6.Match status after joining the manager (running, completed)(I have to keep them in a same controller function or I have to create a new controller for both!!)
