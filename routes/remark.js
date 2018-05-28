import koaRouter from 'koa-router';
import Remark from '../controllers/remark';
import Check from '../middlewares/check'
import validate from "../middlewares/validate"
import Record from '../middlewares/record'
const router=koaRouter()
router.prefix('/remark');


router.post('/',validate("ADDREM"),Check.token,Record.addRemarkRecord,Remark.addRemark);
router.delete('/:remarkId',Check.token,Record.addRemarkRecord,Remark.deleteRemark);
router.put('/:remarkId',Check.token,Record.addRemarkRecord,Remark.updateRemark);


export default router
