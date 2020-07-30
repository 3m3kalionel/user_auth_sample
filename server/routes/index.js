import controllers from '../controllers';

const userController = controllers.user;

const router = app => {
    // route that creates a new user
    app.post('/api/v1/user/signup', userController.createUser);

    // route that retrieves a user
    app.get('/api/v1/user/signin', userController.signIn);
}

export default router;
