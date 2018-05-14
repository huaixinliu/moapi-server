import koaRouter from 'koa-router';
import Record from '../controllers/record';


const router=koaRouter()
router.prefix('/record');




router.get('/interfase/:interfaseId',Record.getInterfaseRecord);



export default router
