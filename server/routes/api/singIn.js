const UserSession = require('../../models/UserSession');
const User = require('../../models/User');
const passport = require('passport');

module.exports = (app) => {
    app.get('/api/account/verify', (req, res, next) => {
        // Get the token
        const { query } = req;
        const { token } = query;
        console.log('44444');
        // ?token=test
        // Verify the token is one of a kind and it's not deleted.
        UserSession.find({
        _id: token,
        isDeleted: false
        }, (err, sessions) => {
        if (err) {
            console.log(err);
            return res.send({
            success: false,
            message: 'Error: Server error'
            });
        }
        if (sessions.length != 1) {
            return res.send({
            success: false,
            message: 'Error: Invalid'
            });
        } else {
            // DO ACTION
            return res.send({
            success: true,
            message: 'Good'
            });
        }
        });
    });    
    // app.post('/api/account/signin', (req, res, next) => {
    //     let {email, password} = req.body;
    //     console.log('guan1255');
    //     console.log(req.body);
    //     if(!email){
    //         return res.send({
    //             success:false,
    //             message: 'Email does not exitst'
    //         })
    //     }

    //     email = email.toLowerCase();
    //     email = email.trim();

    //     if(!password){
    //         return res.send({
    //             success:false,
    //             message: 'Email does not exitst'
    //         })
    //     }

    //     User.find({
    //         email: email
    //     }, (err, users) => {
    //         console.log('*****');
    //         console.log(users);
    //         if(err) {
    //             return res.send({
    //                 success: false,
    //                 message: 'Server Error'
    //             })
    //         }else if(users.length == 0){
    //             return res.send({
    //                 success: false,
    //                 message: 'User not existing'
    //             })
    //         }
    //         const newUser = users[0];
    //         const userSession = new UserSession();
    //         userSession.userId = newUser._id;
    //         userSession.save((err, doc) => {
    //             if(err){
    //                 console.log(err);
    //                 return res.send({
    //                     success: false,
    //                     message: 'Error server error'
    //                 })
    //             }

    //             return res.send({
    //                 success: true,
    //                 message: 'valid sign in',
    //                 token: doc._id
    //             })

    //         })
    //     })
    // })
    app.post('/api/account/signin', (req, res, next) => {
        passport.authenticate("local", {session: false}, function(err, token, info){
             // handle succes or failure
            if(err || !token) {
                return res.status(400).json({
                    success:false,
                    message:"Server Error"
                })
            }
            return res.send({
                success: true,
                message: 'valid sign in',
                token
            })           
        })(req,res,next); 
    });

    app.post('/api/profile', (req, res, next) => {
        passport.authenticate('jwt', {session: false}, function(err, user){
             // handle succes or failure
            if(err || !user) {
                return res.status(400).json({
                    success:false,
                    message:"Server Error"
                })
            }
            return res.send({
                success: true,
                message: 'valid sign in',
                user
            })           
        })(req,res,next); 
    })
}
