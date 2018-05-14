import mongoose from 'mongoose';
import Project from './project'
const Schema = mongoose.Schema;

const ModuleSchema = new Schema({
  id:Number,
  name: String,
  description: String,
  project_id:Number,
  interfases:[{
    type:Schema.Types.ObjectId,
    ref:'Interfase'
  }],
},{timestamps:true});

ModuleSchema.index({id: 1});


const Module = mongoose.model("Module", ModuleSchema);

Module.addModule = async(module) => {
  module = await module.save();
  const project= await Project.findOne({id:module.project_id})
  if(project){
    project.modules.push(module._id);
    project.save()
  }
  return module;
};





Module.deleteModule = async(moduleId) => {
  const module =await Module.findOneAndRemove({id:moduleId})
  if(module){
    Project.findOne({id:module.project_id}).then(project=>{
      if(!project){return};
      let index=project.modules.findIndex(item=>item.equals(module._id));
      if(index>=0){

        project.modules.splice(index,1)
        project.save()
      }
    })
  }

};


export default Module;
