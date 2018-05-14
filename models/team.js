import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const TeamSchema = new Schema({
  id:Number,
  name: String,
  description: Number,
  admin: String,
  members: String,
  private:Boolean
},{timestamps:true});

TeamSchema.index({id: 1});

const Team = mongoose.model("Team", TeamSchema);
export default Team;
