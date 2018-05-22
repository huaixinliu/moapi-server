import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ModuleSchema = new Schema({
  id:Number,
  name: String,
  description: String,
  project_id:Number,
  project:{
    type:Schema.Types.ObjectId,
    ref:'Project'
  },
  interfases:[{
    type:Schema.Types.ObjectId,
    ref:'Interfase'
  }],
},{timestamps:true});

ModuleSchema.index({id: 1});


const Module = mongoose.model("Module", ModuleSchema);

Module.addModule = async(module,project) => {
  module = await module.save();
  project.modules.push(module._id);
  project.save()
  return module;
};


Module.updateModule=async(module,newModuleInfo)=>{
  module.set(newModuleInfo);
  await module.save();
}


Module.deleteModule = async(module,project) => {
    await module.remove()
    let index=project.modules.findIndex(item=>item.equals(module._id));
    if(index>=0){
      project.modules.splice(index,1)
      await project.save()
    }
};


export default Module;
