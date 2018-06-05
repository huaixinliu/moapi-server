import mongoose from 'mongoose'
const Schema = mongoose.Schema;
const docSchema = new mongoose.Schema({
	id: Number,
	creator: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
	title: String,
  project:{
    type: Schema.Types.ObjectId,
    ref: 'Project'
  },
  content:String,
	version:String
},{timestamps:true});


docSchema.statics.addDoc= async(doc,project) => {
  await doc.save();
	project.docs.push(doc._id);
	await project.save()

};

docSchema.statics.updateDoc= async(doc,newDocInfo,project) => {
  doc.set(newDocInfo);
	if(!doc.project){
		doc.project=project._id;
	}
  await doc.save()
};

docSchema.statics.deleteDoc= async(doc,project) => {
  await doc.remove();
  const index=project.docs.findIndex(item=>item.equals(doc._id));
  if(index>=0){
    project.docs.splice(index,1)
    project.save()
  }
};

const Doc= mongoose.model('Doc', docSchema);



export default Doc
