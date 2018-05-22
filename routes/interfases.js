import koaRouter from 'koa-router';
import Interfase from '../controllers/interfase';
import Check from '../middlewares/check'
import Record from '../middlewares/record'


const router=koaRouter()
router.prefix('/interfase');

router.get('/', function (ctx, next) {
  ctx.body = 'this is a interfase api';
});


router.get('/:interfaseId',Interfase.getInterfase);
router.put('/:interfaseId',Check.token,Record.addInterfaseRecord,Interfase.updateInterfase);
router.delete('/:interfaseId',Check.token,Record.addInterfaseRecord,Interfase.deleteInterfase);
router.post('/',Check.token,Record.addInterfaseRecord,Interfase.addInterfase);


export default router
