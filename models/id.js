import mongoose from 'mongoose'

const idSchema = new mongoose.Schema({
	interfase_id: Number,
	project_id: Number,
	user_id: Number,
	team_id: Number,
	module_id: Number,
	remark_id:Number,
	record_id: Number,
	doc_id:Number
});

const Id = mongoose.model('Id', idSchema);

Id.findOne((err, data) => {
	if (!data) {
		const newId = new Id({
      interfase_id: 0,
    	project_id: 0,
    	user_id: 0,
    	team_id: 0,
    	module_id: 0,
			record_id: 0,
			remark_id:0,
			doc_id:0
		});
		newId.save();
	}
})
export default Id
