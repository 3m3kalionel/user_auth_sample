import controllers from '../controllers';

const userController = controllers.user;

const router = app => {
    // route that creates a new user
    app.post('/api/v1/user/signup', userController.createUser);
}

export default router;
