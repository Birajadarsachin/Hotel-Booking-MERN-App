import mongoose from "mongoose"

const PlaceSchema = new  mongoose.Schema({
    owner: {type:mongoose.Schema.Types.ObjectId, ref:'User'},
    title: String,
    address: String,
    photos: [String],
    description: String,
    perks: [String],
    extraInfo: String,
    checkIn: String,
    checkOut: String,
    maxGuests: Number,
    cost:Number,
    currency:String
})

export const Place = mongoose.model('Place',PlaceSchema)