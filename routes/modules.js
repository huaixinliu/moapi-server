import koaRouter from 'koa-router';
import Module from '../controllers/module';
import Check from '../middlewares/check'

const router=koaRouter()
router.prefix('/module');

router.get('/', function (ctx, next) {
  ctx.body = 'this is a interface api';
});


router.delete('/:moduleId',Module.deleteModule);
router.put('/:moduleId',Module.updateModule);
router.post('/',Module.addModule);


export default router
