import controllers from '../controllers';

const userController = controllers.user;

const router = app => {
    // route that creates a new user
    app.post('/api/v1/user/signup', userController.createUser);

    // route that retrieves a user
    app.get('/api/v1/user/signin', userController.signIn);

    // route that sends password reset email
    app.post('/api/v1/user/forgotPassword', userController.requestResetPasswordLink);

    // route that updates a user's password
    app.post('/api/v1/user/resetPassword', userController.resetPassword);
}

export default router;
