import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const recordSchema = new mongoose.Schema({
	type:String,
	id: Number,
	creator: String,
	message: String,
	interfase_id: Number,
	module_id: Number,
  project_id:Number,
	interfase_name: String,
	module_name: String,
  project_name:String,
	interfase: {type:Schema.Types.ObjectId,ref:'Interfase'},
	module: {type:Schema.Types.ObjectId,ref:'Module'},
  project:{type:Schema.Types.ObjectId,ref:'Project'}
},{timestamps:true});


recordSchema.statics.addRecord = async(record) => {
  record = await record.save();
  return record;
};

const Record = mongoose.model('Record', recordSchema);



export default Record
