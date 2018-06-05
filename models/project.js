import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
  id: Number,
  name: String,
  description: String,
  public:Boolean,
  template:{
    headers:Schema.Types.Mixed,
    req:Schema.Types.Mixed,
    res:Schema.Types.Mixed
  },
  admin: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  developers: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  reporters: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  guests: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  proxy: String,
  modules: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Module'
    }
  ],
  version: String,
  versions: [String],
  docs:[
    {
      type: Schema.Types.ObjectId,
      ref: 'Doc'
    }
  ]
}, {timestamps: true});

ProjectSchema.index({id: 1});

const Project = mongoose.model("Project", ProjectSchema);

Project.addProject = async (project) => {
  project = await project.save();
  return project;
};

Project.updateProject=async (project,newProjectInfo)=>{
  project.set(newProjectInfo);
  await project.save()
}

Project.deleteProject=async (project)=>{
  await project.remove()
}

export default Project;
