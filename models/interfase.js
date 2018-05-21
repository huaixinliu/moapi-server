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
  proxy_type:Number,
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
  remark:[
    {
      type: Schema.Types.ObjectId,
      ref: 'Remark'
    }
  ]
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


Interfase.deleteInterfase = async(interfase) => {
    interfase.remove()
    Module.findOne({id:interfase.module_id}).then(module=>{
      if(!module){return};
      let index=module.interfases.findIndex(item=>item.equals(interfase._id));
      if(index>=0){

        module.interfases.splice(index,1)
        module.save()
      }
    })
};

Interfase.updateInterfase= async(interfase,newInterfaseInfo) => {
    interfase.set(newInterfaseInfo);
    await interfase.save();
};



export default Interfase;
