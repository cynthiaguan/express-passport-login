const User = require('../../models/User');

module.exports = (app) => {
    app.post('/api/account/signup', (req, res, next) => {
        const {email, password} = req.body;
        console.log('guan123');
        console.log(req.body);
        if(!email){
            return res.send({
                success:false,
                message: 'Email does not exitst'
            })
        }

        if(!password){
            return res.send({
                success:false,
                message: 'Email does not exitst'
            })
        }

        User.find({
            email: email
        }, (err, previousUsers) => {
            console.log('000');
            if(err) {
                return res.send({
                    success: false,
                    message: 'Server Error'
                })
            }else if(previousUsers.length > 0){
                return res.send({
                    success: false,
                    message: 'Server Error'
                })
            }
            console.log('11144')
            const newUser = new User();
            newUser.email = email;
            newUser.password = newUser.generateHash(password);
            newUser.save((err, user) => {
                if(err) {
                    return res.send({
                        success: false,
                        message: 'Server Error'
                    })
                }
                console.log('1111')
                return res.send({
                    success: true,
                    message: 'Signed up'
                });
            })
        })
    })
}
