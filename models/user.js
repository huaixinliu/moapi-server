import mongoose from 'mongoose';
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  nickname: String,
  age: Number,
  phone: String,
  access_token: String,
  password: String
},{timestamps:true});

UserSchema.index({phone: 1});




var User = mongoose.model("User", UserSchema);

User.findByPhone = async({phone}) => {
  var query = User.findOne({phone});
  var res = null;
  await query.exec(function(err, user) {
    if (err) {
      res = {};
    } else {
      res = user;
    }
  });
  console.log('res====>' + res);
  return res;
};


User.addUser = async(user) => {
  user = await user.save();
  return user;
};

export default User;
