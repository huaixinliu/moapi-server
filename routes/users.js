import koaRouter from 'koa-router';
import User from '../controllers/user';
import Check from '../middlewares/check'

const router=koaRouter()
router.prefix('/users');



router.post('/add',Check.token,User.addUser);
router.post('/delete',User.deleteUser);
router.post('/signup',User.signup);
router.post('/signin',User.signin);
router.post('/signout',User.signout);

export default router
