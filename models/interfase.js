import mongoose from 'mongoose';
import Module from './module'
const Schema = mongoose.Schema;

const InterfaseSchema = new Schema({
  id:Number,
  name: String,
  method: String,
  url: String,
  module_id:Number,
  project_id:Number,
  res: [{
    key:Schema.Types.Mixed,
    name: Schema.Types.Mixed,
    type: Schema.Types.Mixed,
    required: Boolean,
    mock_type: Schema.Types.Mixed,
    mock_num: Schema.Types.Mixed,
    mock_value: Schema.Types.Mixed,
    description: Schema.Types.Mixed,
  }],
  req:[{
    key:Schema.Types.Mixed,
    name: Schema.Types.Mixed,
    type: Schema.Types.Mixed,
    required: Boolean,
    mock_type: Schema.Types.Mixed,
    mock_num: Schema.Types.Mixed,
    mock_value: Schema.Types.Mixed,
    description: Schema.Types.Mixed
  }],
  remind:[{
    version:String,
    description:String,
    time_stamp:Number,
    author_name:String
  }],
  record:[{
    version:String,
    description:String,
    time_stamp:Number,
    type:String,
    author_name:String
  }]
},{timestamps:true});

InterfaseSchema.index({id: 1});

const Interfase = mongoose.model("Interfase", InterfaseSchema);

Interfase.addInterfase = async(interfase) => {
  const newInterfase = await interfase.save(err=>{
    if(!err){
      Module.findOne({id:interfase.module_id}).exec((err,module)=>{
        module.interfases.push(interfase._id);
        module.save()
      })
    }
  });
  return newInterfase;
};


Interfase.deleteInterfase = async(interfaseId) => {
  const interfase =await Interfase.findOneAndRemove({id:interfaseId})
  if(interfase){
    Module.findOne({id:interfase.module_id}).then(module=>{
      if(!module){return};
      let index=module.interfases.findIndex(item=>item.equals(interfase._id));
      if(index>=0){

        module.interfases.splice(index,1)
        module.save()
      }
    })

    return interfase;
  }

};



export default Interfase;
