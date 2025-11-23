import jwt from "jsonwebtoken";

export const verifyAcessToken = (req,res,next) => {
    try {
        
        const header = req.headers.authorization;

        if (!header || !header.startsWith("Bearer ")) {
          return res.status(401).json({
            message: "Unauthorized : No token provided"
          });
        };

        const token = header.split(" ")[1];
        //It is splitting the header according to one word.
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;
        next();

    } catch (error) {
        return res.status(401).json({
            message: "Access token expired or invalid!!"
        });
    }
};