import koaRouter from 'koa-router';
import Remark from '../controllers/remark';
import Check from '../middlewares/check'
import validate from "../middlewares/validate"

const router=koaRouter()
router.prefix('/remark');


router.post('/',validate("ADDREM"),Check.token,Remark.addRemark);
router.delete('/:remarkId',Check.token,Remark.deleteRemark);
router.put('/:remarkId',Check.token,Remark.updateRemark);


export default router
