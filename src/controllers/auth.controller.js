import { connectToBD } from "../db.js";
import bcrypt from 'bcryptjs';
import { createAccessToken, verifyTokenJ } from '../libs/jwt.js';

const handleServerError = (res, error) => {
    return res.status(500).json([error.detail]);
};


export const register = async (req, res) => {
    try {
        const client = await connectToBD();
        const {email, password, username} = req.body;

        const consultSearch = "SELECT email FROM users WHERE email = $1"
        const valuesEmail = [email]
        const emailFound = await client.query(consultSearch,valuesEmail)

        if (emailFound.rows[0]!= undefined){ return res.status(400).json(['The email is already in use'])}

        const passwordHash = await bcrypt.hash(password,10);

        const consultInsert = 'INSERT INTO users(email,username,password) VALUES ($1,$2,$3) RETURNING user_id,username,email,create_date';
        const values = [email,username,passwordHash]
        const result = await client.query(consultInsert,values);
        client.release();

        const token = await createAccessToken({user_id: result.rows[0].user_id})
        res.cookie('token', token);
        res.json({
            user_id:result.rows[0].user_id,
            username:result.rows[0].username,
            email:result.rows[0].email,
            create_date:result.rows[0].create_date,
        })
    } catch (error) {
        handleServerError(res, error);
    }
}

export const login = async (req, res) => {
    try {
        const client = await connectToBD();
        const {email, password } = req.body;

        const consultSearch = "SELECT user_id,username,email,password FROM users WHERE email = $1"
        const values = [email]
        const resultFound = await client.query(consultSearch,values)
        
        client.release();
        if (resultFound.rows[0]==undefined ) return res.status(400).json({message: 'user no found'});

        const isMatch = await bcrypt.compare(password,resultFound.rows[0].password);
        
        if (!isMatch) return res.status(400).json(['Password o email is incorrect']);

        const token = await createAccessToken({user_id: resultFound.rows[0].user_id})
        res.cookie('token', token);
        res.json({
            user_id:resultFound.rows[0].user_id,
            username:resultFound.rows[0].username,
            email:resultFound.rows[0].email,
            //create_date:userFound.rows[0].create_date,
        })
    } catch (error) {
        console.log(error)
        handleServerError(res, error);
    }
}

export const logout = async (req,res) => {
    res.cookie('token', "" ,{
        expires: new Date(0)
    })
    return res.sendStatus(200)
}

export const profile = async (req, res) => {
    try {
        const client = await connectToBD();
        const {user_id } = req.user;
        const text = "SELECT user_id,email,password FROM users WHERE user_id = $1"
        const values = [user_id]
        const userFound = await client.query(text,values)
        client.release();

        if (userFound.rowCount<1) {return res.status(400).json(['user no found']);}
        return res.send(userFound.rows[0])
    } catch (error) {
        handleServerError(res, error);
    }
};

export const verifyToken = async (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    return res.send(401).json({ message: "Unauthorization" });
  }
  try {
    const client = await connectToBD();
    const user = await verifyTokenJ(token);
    const consultSearch ="SELECT user_id,username,email FROM users WHERE user_id = $1";
    const values = [user.user_id];
    const resultFound = await client.query(consultSearch, values);
    client.release();
    if (resultFound.rows[0] == undefined)
      return res.status(401).json({ message: "user no found" });
    res.json({
      user_id: resultFound.rows[0].user_id,
      username: resultFound.rows[0].username,
      email: resultFound.rows[0].email,
    });
  } catch (error) {
    return res.sendStatus(401);
  }
};