import mongoose from 'mongoose'
import interfaseModel from './interfase'
const remarkSchema = new mongoose.Schema({
	id: Number,
	creator: String,
	message: String,
	interfase_id: Number,
	module_id: Number,
  project_id:Number,
	version:String
},{timestamps:true});


remarkSchema.statics.addRemark= async(remark,interfase) => {
  await remark.save();
	interfase.remarks.push(remark._id);
	await interfase.save()

};

remarkSchema.statics.updateRemark= async(remark,newRemarkInfo) => {
  remark.set(newRemarkInfo);
  await remark.save()
};

remarkSchema.statics.deleteRemark= async(remark,interfase) => {
  await remark.remove();
  const index=interfase.remarks.findIndex(item=>item.equals(remark._id));
  if(index>=0){
    interfase.remarks.splice(index,1)
    interfase.save()
  }
};

const Remark= mongoose.model('Remark', remarkSchema);



export default Remark
