import koaRouter from 'koa-router';
import Remark from '../controllers/remark';
import Check from '../middlewares/check'

const router=koaRouter()
router.prefix('/remark');


router.post('/',Check.token,Remark.addRemark);
router.delete('/:remarkId',Check.token,Remark.deleteRemark);
router.put('/:remarkId',Check.token,Remark.updateRemark);


export default router
