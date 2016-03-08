// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'      : '487176264808547', // your App ID
        'clientSecret'  : '31ebed1f59bd7023d5b15d258664892a', // your App Secret
        'callbackURL'   : 'http://localhost:8080/auth/facebook/callback'
    },

    'twitterAuth' : {
        'consumerKey'       : 'your-consumer-key-here',
        'consumerSecret'    : 'your-client-secret-here',
        'callbackURL'       : 'http://localhost:8080/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'      : '437190576697-r14i7j6nuc1t5aorkbuidc5im54nujnd.apps.googleusercontent.com',
        'clientSecret'  : ' SsZZKm1B4xILQJAkM6oH8_lB',
        'callbackURL'   : 'http://localhost:8080/auth/google/callback'
    }

};
