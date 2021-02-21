var LocalStrategy = require('passport-local').Strategy;
const User = require('./usermodel');
const bcrypt = require('bcrypt');

module.exports = function(passport) {
    passport.use(new LocalStrategy(function(username, password, done) {
        console.log(username, password)
        User.findOne({email: username,
        }, function(err, doc) {
            if (err) {
                done(err)
            } else {
                if (doc) {
                        bcrypt.compare(password, doc.password)
                            .then(function(res) {
                                console.log(res);
                                if (res) {
                                    done(null, doc)
                                } else {
                                    done(null, false)
                                }
                            })
                } else {
                    done(null, false)
                }
            }
        })
    }))

    passport.serializeUser(function(user, done) {
        done(null, user)
    })

    passport.deserializeUser(function(user, done) {
        done(null, user)
    })
}