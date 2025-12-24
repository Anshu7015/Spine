
export const demoFunction = async function(req, res) {
   try {
    const {userId,fcmToken,platform,deviceId,modelName} = req.body;
    if (!userId, !fcmToken, !platform, !deviceId, !modelName) {
        console.log(error);
        return res.status(404).json({
            success : false,
            message : "Invalid credentials"
        })
    }
    return res.status(202).json({
        success : true,
        message : "all the details are fetched!!"
    })
   } catch (error) {
    console.log(error);
    return res.status(500).json({
        success : false,
        message : "Internal server error!!"
    })
   } 
}