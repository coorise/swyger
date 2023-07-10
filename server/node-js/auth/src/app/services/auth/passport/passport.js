
import { Strategy as StrategyJwt, ExtractJwt } from 'passport-jwt';
/*import FacebookTokenStrategy from 'passport-facebook-token';
import { Strategy as GoogleTokenStrategy } from 'passport-google-token';
import LocalStrategy from 'passport-local';
import _ from 'lodash';
import util from 'util';

//import User from '../api/users/users.model';
import {logger} from '../../index';*/


import typeToken from './typeorm/type.model';



/*// used to serialize the user for the session
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});*/

export const applyPassportStrategy =(passport) => {
  // JWT
  const jwtOpts = {};
  jwtOpts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  jwtOpts.secretOrKey = process.env.JWT_SECRET;
  jwtOpts.ignoreExpiration = false
  passport.use('jwt',
    new StrategyJwt(jwtOpts, async function(payload, done) {
      //logger.info('strategy get uid from token')
      //console.log(payload )
      await typeToken(payload,done)
    })
  );
}


/*
// Facebook
passport.use('facebook-token',
  new FacebookTokenStrategy(
    {
      clientID: config.facebook.clientID,
      clientSecret: config.facebook.clientSecret,
      profileFields: ['id', 'first_name', 'last_name', 'email', 'picture']
    },
    function(accessToken, refreshToken, profile, done) {
      // asynchronous
      process.nextTick(function() {
        profile = profile['_json'];
        logger.info('========profile=--=======', profile);
        // find the user in the database based on their facebook id
        User.findOne({ email: profile.email }, function(err, user) {
          // if there is an error, stop everything and return that
          // ie an error connecting to the database
          if (err) return done(err);

          // if the user is found, then log them in
          if (user) {
            if (user.avatar) {
              return done(null, user); // user found, return that user
            } else {
              user.avatar = util.format(
                'http://graph.facebook.com/%s/picture?type=large',
                profile.id
              );
              user.save(function(err, data) {
                if (err) throw err;

                // if successful, return the user
                return done(null, data);
              });
            }
          } else {
            // if there is no user found with that facebook id, create them
            var newUser = new User();

            // set all of the facebook information in our user model
            newUser.services.facebook.id = profile.id;
            newUser.services.facebook.token = accessToken;
            newUser.first_name = profile.first_name;
            newUser.last_name = profile.last_name;
            newUser.email = profile.email;
            newUser.avatar = util.format(
              'http://graph.facebook.com/%s/picture?type=large',
              profile.id
            );
            var new_user = _.assign(newUser, { new: true });
            // new_user.new = true;
            // save our user to the database
            newUser.save(function(err) {
              if (err) {
                throw err;
              }
              // if successful, return the new user
              return done(null, new_user);
            });
          }
        });
      });
    }
  )
);

// local
const localOpts = {
  usernameField: 'email'
};

const localStrategy = new LocalStrategy(localOpts, (email, password, done) => {
  logger.info('========localStrategy========');
  User.findOne({
    email
  })
    .then(user => {
      if (!user) {
        return done(null, false);
      } else if (!user.verifyPassword(password)) {
        return done(null, false);
      }
      return done(null, user);
    })
    .catch(err => {
      return done(err, false);
    });
});

passport.use('local',localStrategy);

// Google
passport.use('google-token',
  new GoogleTokenStrategy(
    {
      clientID: config.google.clientID,
      clientSecret: config.google.clientSecret
    },
    function(accessToken, refreshToken, profile, done) {
      // logger.info("=========profile============: ", profile);
      process.nextTick(function() {
        profile = profile['_json'];
        // logger.info("=========profile============: ", profile);
        // find the user in the database based on their facebook id
        User.findOne({ email: profile.email }, function(err, user) {
          // if there is an error, stop everything and return that
          // ie an error connecting to the database
          if (err) return done(err);

          // if the user is found, then log them in
          if (user) {
            return done(null, user); // user found, return that user
          } else {
            // if there is no user found with that facebook id, create them
            var newUser = new User();

            // set all of the facebook information in our user model
            newUser.services.google.id = profile.id;
            newUser.services.google.token = accessToken;
            newUser.first_name = profile.given_name;
            newUser.last_name = profile.family_name;
            newUser.email = profile.email;
            newUser.avatar = profile.picture;
            var new_user = _.assign(newUser);

            // save our user to the database
            newUser.save(function(err) {
              if (err) throw err;

              // if successful, return the new user
              return done(null, new_user);
            });
          }
        });
      });
    }
  )
);*/
