// const {model,Schema}=require('mongoose');

// const vehicleSchema=new Schema({
//     vehicle_id:{
//         type:String,
//         required:true,
//         unique:true,
//     },
//     email:{
//         type: Schema.Types.ObjectId,
//         required: true,
//         unique: true,
//         match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
//     },
//     vehicle_type:{
//         type:String,
//         enum:['truck','van','other'],
//         required:true,
//     },
//     model:{
//       type:String,
//     },
//     capacity:{
//         type:String,
//         required:true,
//     },
//     length:{
//         type:String,
//         required:true,
//     },
//     height:{
//         type:String,
//         required:true,
//     },
//     availability_status:{
//        type:Boolean,
//        required:true,
//     },
// },
// {timestamps:true});

// const Vehicle=model('vehicle',vehicleSchema);
// module.exports=Vehicle;


const { model, Schema } = require('mongoose');

const vehicleSchema = new Schema(
  {
    vehicle_id: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    vehicle_type: {
      type: String,
      enum: ['truck', 'van', 'other'],
      required: true,
    },
    model_make: {
      type: String,
      required: true,
    },
    registration_number: {
      type: String,
      required: true,
      unique: true,
    },
    engine_number: {
      type: String,
      required: true,
      unique: true,
    },
    fuel_type: {
      type: String,
      enum: ['petrol', 'diesel', 'electric', 'hybrid'],
      required: true,
    },
    capacity: {
      type: String,
      required: true,
    },
    length: {
      type: String,
      required: true,
    },
    height: {
      type: String,
      required: true,
    },
    availability_status:
     { type: Boolean,
       required: true,
        default: true },
  },
  { timestamps: true }
);

const Vehicle = model('vehicle', vehicleSchema);
module.exports = Vehicle;
