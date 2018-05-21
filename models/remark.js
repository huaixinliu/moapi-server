import mongoose from 'mongoose'
import interfaseModel from './interfase'
const remarkSchema = new mongoose.Schema({
	id: Number,
	creator: String,
	message: String,
	interfase_id: Number,
	module_id: Number,
  project_id:Number
},{timestamps:true});


remarkSchema.statics.addRemark= async(remark) => {
  await remark.save();
  const interfase=await interfaseModel.findOne({id:remark.interfase_id})
  if(interfase){
    interfase.remark.push(remark._id);
    await interfase.save()
  }
};

remarkSchema.statics.updateRemark= async(remark,newRemarkInfo) => {
  console.log(remark)
  remark.set(newRemarkInfo);
  await remark.save()
};

remarkSchema.statics.deleteRemark= async(remark) => {
  await remark.remove();
  const interfase=await interfaseModel.findOne({id:remark.interfase_id})
  if(!interfase){return;}
  const index=interfase.remark.findIndex(item=>item.equals(remark._id));
  if(index>=0){
    interfase.remark.splice(index,1)
    interfase.save()
  }
};

const Remark= mongoose.model('Remark', remarkSchema);



export default Remark
