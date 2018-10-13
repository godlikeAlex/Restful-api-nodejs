/*
* Helper for various tasks
*
*
*/

// Dependcies
const crypto = require('crypto');
const config = require('./config');
const _data = require('./data');

// Container
let helpers = {};
 
// Parse a JSON string to an object in all cases, without  throwing
helpers.parseJsonToObject = function(str){
    try{
        return JSON.parse(str);
    }catch(e){
        return {};
    }
};

// Create a string of random alphunameric characters, of gaven length
helpers.createRandomString = function(strLength){
    strLength = typeof(strLength) === 'number' && strLength > 0 ? strLength : false;
    if(strLength){
      // Define all the possible characters that could go into a string
      const possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  
      // Start the final string
      let str = '';
      for(i = 1; i <= strLength; i++) {
          // Get a random character from the possibleCharacters string
          let randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
          // Append this character to the string
          str+=randomCharacter;
      }
      // Return the final string
      return str;
    } else {
      return false;
    }
};

// SHA 256 Hash
helpers.hash = function(str){
    if(typeof(str) === 'string' && str.length > 0){
        return crypto.createHash('sha256', config.hashingSecret).update(str).digest('hex');
    }else{
        return false;
    }
};

helpers.getTemplate = function(template,data,callback){
    template = typeof(template) === 'string'&& template.length > 0 ? template : false;
    data = typeof(data) === 'object' && data !== null ? data : {};
};

// Export the module
module.exports = helpers;