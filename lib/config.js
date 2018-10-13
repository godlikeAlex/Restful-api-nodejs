/*
* Create and export configuration varibles
*
*
*/


let config = {
    'httpPort': 3000,
    'httpsPort':3001,
    'envNmae' : 'staging',
    'hashingSecret' : 'thisIsASecret',
}

// Export the module
module.exports = config;