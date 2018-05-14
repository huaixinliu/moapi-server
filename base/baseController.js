import Id from '../models/id'

export default class BaseController{
  async getId(type){
			const idData = await Id.findOne();
			idData[type] ++ ;
			await idData.save();
			return idData[type]
	}
}
