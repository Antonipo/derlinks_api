import jwt, { decode } from "jsonwebtoken";

export const authRequired = (req,res,next) =>{
    const { token } = req.cookies

    if(!token) return res.status(401).json({message:"No token, authorization denied"});

    jwt.verify(token,process.env.TOKEN_SECRET,(err,decode)=>{
        if (err) return res.status(401).json({message:"invalid token"});
        req.user = decode;
        next();
    })
    
} 