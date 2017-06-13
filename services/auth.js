const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); //see: https://github.com/auth0/node-jsonwebtoken
const config = require('../config');
const logger = require('../utils/logger')
const generate_id = require('../utils/unique_id'); 


const salt_rounds = 5;

function generate_tokens(payload){
  //TODO: we should involve some mechanism to 'logout' the long live refresh_token
  const refresh_token = jwt.sign(payload, config.jwt.secret);
  //access token will be expired in 1 hour
  const access_token = generate_access_token(payload);
  return {refresh_token, access_token};
}

function generate_access_token(payload){
  return jwt.sign(payload, config.jwt.secret, { expiresIn: 60 * 60 });
}

function verify_token(token){
  return jwt.verify(token, config.jwt.secret);
}

class AuthService{

  constructor({db}){
    this.db = db;
  }
  
  signup(username, password){    
    const db = this.db;
    return bcrypt.hash(password, salt_rounds).then((hashed_password)=>{
      const id = generate_id(10);
      return db.set('auth:' + username, JSON.stringify({p:hashed_password, id:id}), 'NX')
	.then(()=>{
	  //if set operration succeed, generate refresh and access token
	  return generate_tokens({username, id});
	});
    }).catch((e) => {
      logger.debug(e);
      throw new Error("sign_up_failed_username_in_use");
    })
  }

  signin(username, password){
    return this.db.get('auth:' + username).then((str_auth) => {
      const auth = JSON.parse(str_auth)
      bcrypt.compare(password, auth.p).then((result)=>{
	if(result){
	  return generate_tokens({username:username, id:auth.id});
	}else{
	  throw new Error("sign_in_failed_incorrect_username_password")
	}
      })
    })
  }

  authenticate(access_token){
    return verify_token(access_token);
  }
  
  refresh(refresh_token) {
    return generate_access_token(verify_token(refresh_token));
  }
}

module.exports = AuthService
