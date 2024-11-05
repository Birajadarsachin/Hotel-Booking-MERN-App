import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { User } from './models/schemas/user.mjs';
import { hashPassword, comparePassword } from './utils/helpers.mjs';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import imageDownloader from 'image-downloader'
import { fileURLToPath } from 'url';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';
import fs from 'fs'
import { Place } from './models/schemas/Place.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
dotenv.config();
const jwtsecret = 'secret';

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('Connected to the db'))
    .catch((err) => console.log(err));

app.use(express.json());
app.use(cookieParser());
app.use('/uploads',express.static(__dirname+'/uploads'))
app.use(cors({
    credentials: true,
    origin:['http://localhost:5173', 'http://localhost:5174']
}));

app.get('/test', (req, res) => {
    res.send({ msg: 'done' });
});

app.put('/register', async (req, res) => {
    const { name, email, pass } = req.body;
    const existingUser = await User.findOne({
        $or: [
            { username: name },
            { email: email }
        ]
    });
    if (existingUser) {
        const errorMessages = [];
        if (existingUser.username === name) {
            errorMessages.push('Username already exists');
        }
        if (existingUser.email === email) {
            errorMessages.push('Email already exists');
        }
        return res.status(400).send({ error: errorMessages });
    }
    const newUser = new User({
        username: name,
        email: email,
        password: hashPassword(pass)
    });
    try {
        const savedUser = await newUser.save();
        return res.status(201).send(savedUser);
    } catch (error) {
        return res.status(500).send({ error: 'Failed to register user' });
    }
});

app.post('/login', async (req, res) => {
    const { email, pass } = req.body;
    const existUser = await User.findOne({ email: email });
    if (existUser) {
        const isPassword = comparePassword(pass, existUser.password);
        if (isPassword) {
            jwt.sign(
                { email: existUser.email, id: existUser._id },
                jwtsecret,
                {},
                (err, token) => {
                    if (err) {
                        return res.status(500).send('Error generating token');
                    }
                    res.cookie('token', token, {
                        httpOnly: true,
                        secure: false, 
                        sameSite: 'Strict' 
                    }).json(existUser);
                }
            );
        } else {
            return res.status(401).send('Wrong Password. Try again');
        }
    } else {
        return res.status(404).send('Sorry, your email is not registered');
    }
});

app.get('/profile', (req, res) => {
    const { token } = req.cookies;

    if (token) {
        jwt.verify(token, jwtsecret, {}, async (err, user) => {
            if (err) {
                console.error("Token verification failed:", err);
                return res.status(403).json({ error: "Token is invalid" });
            }
            const {username,email,_id} = await User.findById(user.id)
            res.json({name:username,email,id:_id});
        });
    } else {
        res.json(null);  
    }
});

app.post('/logout',(req,res)=>{
    res.cookie('token','').json(true)
})

app.post('/uploadByLink',async (req,res)=>{
    const {link} = req.body
    const newName = uuidv4() + '.jpg'
    try{
        if(link){
            await imageDownloader.image({
                url:link,
                dest: path.join(__dirname,'uploads',newName)
            })
            res.status(200).json({success:true,filename:newName})
        }
        
    }catch(error){
        console.error("Download error:", error)
        res.status(500).json({ success: false, message: 'Failed to download image' })
    }
    return 

})

const photosMiddleware = multer({dest:'uploads/'})
app.post('/upload',photosMiddleware.array('photos',100),(req,res)=>{
    const uploadedFiles = []
    for(let i =0;i<req.files.length;i++){
        const {path,originalname} = req.files[i]
        const parts = originalname.split('.')
        const np = path + '.' + parts[parts.length - 1]
        fs.renameSync(path,np)
        uploadedFiles.push(np.replace('uploads\\',''))

    }
    res.json(uploadedFiles)
})

app.post('/places',async (req,res)=>{
    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, jwtsecret, {}, async (err, user) => {
            if (err) {
                console.error("Token verification failed:", err);
                return res.status(403).json({ error: "Token is invalid" });
            }
            const {username,email,_id} = await User.findById(user.id)
            const {title,address,existingPhotos,
                description,perks,extraInfo,
                checkIn,checkOut, guestInfo,currency,price} = req.body
            try{
                const newPlace = new Place({
                owner:_id,
                title: title,
                address: address,
                photos: existingPhotos,
                description: description,
                perks: perks,
                extraInfo: extraInfo,
                checkIn: checkIn,
                checkOut: checkOut,
                maxGuests: guestInfo,
                cost:price,
                currency:currency
            })
            await newPlace.save()
            res.json({ success: true, place: newPlace });
            } catch (saveError) {
                console.error("Error saving place:", saveError);
                res.status(500).json({ error: "Failed to save place" });
            }
        });
    } else {
        res.json(null);  
    }
})

app.get('/userplaces',(req,res)=>{
    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, jwtsecret, {}, async (err, user) => {
            if (err) {
                console.error("Token verification failed:", err);
                return res.status(403).json({ error: "Token is invalid" });
            }
            const {id} = user
            res.json(await Place.find({owner:id}))
    })
    }else {
        res.json(null);  
    }
})
app.put('/places',async (req,res)=>{
    const { token } = req.cookies;
    const {id,title, address, existingPhotos,
        description, perks, extraInfo,
        checkIn, checkOut, guestInfo,currency,price} = req.body
        try {
            jwt.verify(token, jwtsecret, {}, async (err, user) => {
                if (err) {
                    return res.status(401).json({ error: "Unauthorized" });
                }
    
                const placeDoc = await Place.findById(id);
                
                // Check if the user is the owner of the place
                if (user.id === placeDoc.owner.toString()) {
                    const updatedPlace = await Place.findOneAndUpdate(
                        { _id: id },
                        {
                            title,
                            address,
                            photos: existingPhotos,
                            description,
                            perks,
                            extraInfo,
                            checkIn,
                            checkOut,
                            maxGuests: guestInfo,
                            cost:price,
                            currency:currency
                        },
                        { new: true }
                );
                return res.status(200).json(updatedPlace);
            } else {
                return res.status(403).json({ error: "Forbidden: Not the owner" });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update the place" });
    }
});  

app.get('/places/:id', async (req, res) => {
    try {
        const data = await Place.findById(req.params.id);
        if (!data) {
            return res.status(404).json({ message: 'Place not found' });
        }
        return res.json(data);
    } catch (error) {
        console.error('Error fetching place:', error);
        return res.status(500).json({ message: 'Server error' });
    }
});

app.get('/places',async (req,res)=>{
    res.json(await Place.find())
})



app.listen(4000);
