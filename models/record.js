import mongoose from 'mongoose'

const recordSchema = new mongoose.Schema({
	type:String,
	id: Number,
	creator: String,
	message: String,
	interfase_id: Number,
	module_id: Number,
  project_id:Number
},{timestamps:true});


recordSchema.statics.addRecord = async(record) => {
  record = await record.save();
  return record;
};

const Record = mongoose.model('Record', recordSchema);



export default Record
