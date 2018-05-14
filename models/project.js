import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
  id:Number,
  name: String,
  description: Number,
  admin: String,
  members: String,
  modules:[{
    type:Schema.Types.ObjectId,
    ref:'Module'
  }],
  version:String,
  versions:[String],
  record:[]
},{timestamps:true});

ProjectSchema.index({id: 1});

const Project = mongoose.model("Project", ProjectSchema);

Project.addProject = async(project) => {
  project = await project.save();
  return project;
};

export default Project;
