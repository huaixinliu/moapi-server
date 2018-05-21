import koaRouter from 'koa-router';
import Module from '../controllers/module';
import Check from '../middlewares/check'

const router=koaRouter()
router.prefix('/module');

router.get('/', function (ctx, next) {
  ctx.body = 'this is a interface api';
});


router.delete('/:moduleId',Check.token,Module.deleteModule);
router.put('/:moduleId',Check.token,Module.updateModule);
router.post('/',Check.token,Module.addModule);


export default router
