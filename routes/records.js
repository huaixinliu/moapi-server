import koaRouter from 'koa-router';
import Record from '../controllers/record';
import Check from '../middlewares/check'

const router=koaRouter()
router.prefix('/record');




router.get('/interfase/:interfaseId',Record.getInterfaseRecord);

router.get('/',Check.token,Record.getRecord);

export default router
