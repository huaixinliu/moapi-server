import koaRouter from 'koa-router';
import User from '../controllers/user';
import Check from '../middlewares/check'

const router=koaRouter()
router.prefix('/users');


router.get('/',Check.token,User.getUserList);
router.post('/add',Check.token,Check.admin,User.addUser);
router.post('/delete',Check.token,Check.admin,User.deleteUser);
router.post('/signup',User.signup);
router.post('/signin',User.signin);
router.post('/signout',User.signout);

router.get('/watch-project',Check.token,User.getWatchProject);
router.post('/watch-project',Check.token,User.addWatchProject);
router.put('/watch-project',Check.token,User.deleteWatchProject);

export default router
