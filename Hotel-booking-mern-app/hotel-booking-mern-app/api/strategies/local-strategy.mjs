import passport from "passport";
import { Strategy } from "passport-local";
import { comparePassword } from "../utils/helpers.mjs";
import { User } from "../models/schemas/user.mjs";


export default passport.use(
    new Strategy(async (username,password,done) =>{
        try{
            const findUser = await User.findOne({username:username})
            if(!findUser) throw new Error("user not found")
        }catch(err){
            done(err,null)
        }
    })
)