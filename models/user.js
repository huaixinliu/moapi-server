import mongoose from 'mongoose';
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  name: String,
  age: Number,
  phone: String,
  access_token: String,
  password: String,
  type:Number,
  id:Number,
  watch_projects:[{type:Schema.Types.ObjectId,ref:'Project'}]
},{timestamps:true});

UserSchema.index({id: 1});




var User = mongoose.model("User", UserSchema);




User.addUser = async(user) => {
  user = await user.save();
  return user;
};

export default User;
