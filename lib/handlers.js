// Dependecies 
const _data = require('./data');
const helpers = require('./helpers');


// Container for all data functions
let handlers = {};

// Index main page
handlers.index = function(data,callback){
  if(data.method === 'get'){

  }else{
      callback(405,undefined,'html');
  }
};


/*
*
* Json api
*
*/
// Handler users
handlers.users = function(data,callback){
    const acceptableMethods = ['post','get','put','delete'];
    if(acceptableMethods.indexOf(data.method) > -1){
        handlers._users[data.method](data,callback);
    }else{
        callback(405);
    }
};

// Container for the users sub methods
handlers._users = {};

// Users - post
// Required data - userName, password, Email, City , tosAgreement 
handlers._users.post = function(data,callback){
    let name = typeof(data.payload.name) === 'string' && data.payload.name.trim().length > 0 ? data.payload.name.trim() : false;
    let password = typeof(data.payload.password) === 'string' && data.payload.password.trim().length > 5 ? data.payload.password.trim() : false;
    let mail = typeof(data.payload.mail) === 'string' && data.payload.mail.trim().length > 0 ? data.payload.mail.trim() : false;
    let city = typeof(data.payload.city) === 'string' && data.payload.city.trim().length > 0 ? data.payload.city.trim() : false;
    let tosAgreement = typeof(data.payload.tosAgreement) === 'boolean'&& data.payload.tosAgreement !== false ? true : false;

    if(name && password && mail && city && tosAgreement){
        // Make the sure that the user dosent already exist
        _data.read('users', name, err => {
            if (err) {
                // Hash the user password
                let hashPassword = helpers.hash(password);
                if (hashPassword) {
                    // User object
                    let userObj = {
                        'name': name,
                        'password': hashPassword,
                        'mail': mail,
                        'city': city,
                        'tosAgreement': tosAgreement,
                        'posts': []
                    };
                    _data.create('users', name, userObj, err => {
                        if (!err) {
                            callback(200)
                        } else {
                            console.log(err);
                            callback(500, {'Error': 'Cloud not hash the user password'});
                        }
                    });
                } else {
                    callback(500, {'Error': 'Failed create hash password'});
                }
            } else {
                callback(500, {'Error': 'A user with that user name allready exists'});
            }
        });
    }else{
        callback(400,{'Error':'Missing required fields'})
    }

};

// Users - get


handlers._users.get = function(data,callback){
    // Get profile user
    // Required data - id

    // Get the queryString
    let id = typeof(data.queryStringObject.user) === 'string' && data.queryStringObject.user.trim().length > 0 ? data.queryStringObject.user.trim() : false;
    if(id){
        _data.read('users',id,(err,data)=>{
            if(!err && data){
                callback(200,data);
            }else{
                callback(403,{'Error':'Cloud not fined the user'})
            }
        });
    }else{
        callback(400,{'Error':'Missing required fields'});
    }
};

// Users - put
// Required data - userName
// Optional data -
handlers._users.put = function(data,callback){
    let userName = typeof(data.payload.name) === 'string' && data.payload.name.trim().length > 0 ? data.payload.name.trim() : false;
    // Check for optional fields
    let name = typeof(data.payload.name) === 'string' && data.payload.name.trim().length > 0 ? data.payload.name.trim() : false;
    let password = typeof(data.payload.password) === 'string' && data.payload.password.trim().length > 5 ? data.payload.password.trim() : false;
    let mail = typeof(data.payload.mail) === 'string' && data.payload.mail.trim().length > 0 ? data.payload.mail.trim() : false;
    let city = typeof(data.payload.city) === 'string' && data.payload.city.trim().length > 0 ? data.payload.city.trim() : false;
    if(userName){
        if(name || password || mail || city){
            _data.read('users',name,(err,userData)=>{
                if(name){
                    userData.name = name;
                }
                if(password){
                    userData.password = helpers.hash(password);
                }
                if(mail){
                    userData.mail = mail;
                }
                if(city){
                    userData.city = city;
                }
                // Update the user data
                _data.update('users',userName,userData,err=>{
                    if(!err){
                        callback(200,userData);
                    }else{
                        callback(500,{'Error':'Cloud not update the user'});
                    }
                });
            });
        }else{
            callback(400,{'Error':'Missing required fields'});
        }
    }else{
        callback(400,{'Error':'Missing required fields'});
    }
};

// Users - delete
// Required Data - userName
handlers._users.delete = function(data,callback){
    let userName = typeof(data.queryStringObject.user) === 'string' && data.queryStringObject.user.trim().length > 0 ? data.queryStringObject.user.trim() : false;
    if(userName){
        _data.read('users',userName,err=>{
            if(!err){
                _data.delete('users',userName,err=>{
                    if(!err){
                        callback(200);
                    }else{
                        callback(500,{'Error':'Cloud not delete the user'})
                    }

                });
            }else{
                callback(404,{'Error':'User cloud not fined'});
            }
        });
    }else{
        callback(400,{'Error':'Missing required fields'});
    }
};

// Handler action the user
handlers.usersAction = function(data,callback){
    if(['get'].indexOf(data.method) > -1){
        handlers._usersAction[data.method](data,callback);
    }else{
        callback(405);
    }
};

handlers._usersAction = {};

// Get all posts selected user
// Required data - idUser
handlers._usersAction.get = function(data,callback){
    // Get the queryString
    let idUser = typeof(data.queryStringObject.id) === 'string' && data.queryStringObject.id.trim().length > 0 ? data.queryStringObject.id.trim() : false;
    if(idUser){
        _data.read('users',idUser,(err,data)=>{
            if(!err && data){
                _data.listData(data.posts,'posts',(err,posts)=>{
                    if(!err && posts){
                        console.log(posts);
                        callback(200,posts);
                    }else{
                        callback(404,{'Error':'Cloud not find the specified post(s)'})
                    }
                });
            }else{
                callback(400,{'Error':'Cloud not find user'});
            }
        });
    }else{
        callback(400,{'Error':'Missing required fields'});
    }
};

// Handler posts
handlers.posts = function(data,callback){
    const acceptableMethods = ['post','get','put','delete'];
    if(acceptableMethods.indexOf(data.method) > -1){
        handlers._posts[data.method](data,callback);
    }else{
        callback(405);
    }
};

// Container for the posts sub methods
handlers._posts = {};

// Posts - post
handlers._posts.post = function(data,callback){
    // Check that all required fields are filled out
    let title = typeof(data.payload.title) === 'string' && data.payload.title.trim().length > 5 ? data.payload.title.trim() : false;
    let article = typeof(data.payload.article) === 'string' && data.payload.article.trim().length > 5 && data.payload.article.trim().length < 1000 ? data.payload.article.trim() : false;
    let category = typeof(data.payload.category) === 'string' && data.payload.category.trim().length > 0 ? data.payload.category : false;
    let author = typeof(data.payload.author) === 'string' && data.payload.author.trim().length > 0 ? data.payload.author : false;

    if(title && article && category && author){
        // Create random id for article
        let idArticle = helpers.createRandomString(10);

        let postObj = {
            'idArticle':idArticle,
            'title':title,
            'article':article,
            'category':category,
            'author' : author
        };
        
        _data.create('posts',idArticle,postObj,err=>{
            if(!err){
                // Read publisher user for update file and add post
                _data.read('users',author,(err,userData)=>{
                    if(!err && userData){
                        userData.posts = typeof(userData.posts) === 'object' && userData.posts instanceof Array ? userData.posts : [];
                        userData.posts.push(idArticle);
                        _data.update('users',author,userData,err=>{
                            if(!err){
                                callback(200,userData);
                            }else {
                                callback(403,{'Error':'Cloud not update the user'});
                            }
                        });
                    }else{
                        callback(403,{'Error':'User cloud not fined'});
                    }
                });
            }else{
                callback(403,{'Error':'Cloud not create new file'});
            }
        })
    }else{
        callback(400,{'Error':'Missing required fields'});
    }
};

// Posts - get
// Required  id
handlers._posts.get = function(data,callback){
    let id = typeof(data.queryStringObject.article) === 'string' && data.queryStringObject.article.trim().length === 10 ? data.queryStringObject.article : false;
    if(id){
        _data.read('posts',id,(err,data)=>{
            if(!err && data){
                callback(200,data);
            }else{
                callback(403,{'Error': 'Cloud not find file'});
            }
        });
    }else{
        callback(400,{'Error':'Missing required fields'});
    }
};

// Posts - put
// Required data - @TODO
handlers._posts.put = function(data,callback){};

// Posts - delete
// Required Data - postId
handlers._posts.delete = function(data,callback){
    let postId = typeof(data.queryStringObject.post) === 'string' && data.queryStringObject.post.trim().length > 0 ? data.queryStringObject.post.trim() : false;
    if(postId){
        _data.read('posts',postId,err=>{
            if(!err){
                _data.delete('posts',postId,err=>{
                    if(!err){
                        callback(200);
                    }else{
                        callback(500,{'Error':'Cloud not delete the post'})
                    }

                });
            }else{
                callback(404,{'Error':'Post cloud not fined'});
            }
        });
    }else{
        callback(400,{'Error':'Missing required fields'});
    }
};

// Handler main
handlers.main = function(data,callback){
    if(['get'].indexOf(data.method) > -1){
        handlers._main[data.method](data,callback);
    }else{
        callback(405);
    }
};

handlers._main = {};

// Get all article
// Required data - id user
handlers._main.get = function(data,callback){

    _data.list('posts',(err,data)=>{
        if(!err && data){
            _data.listData(data,'posts',(err,postData)=>{
                if(!err && postData){
                    callback(200,{'posts':postData});
                    console.log(postData)
                }else{
                   callback(400,{'Error':'Posts '})
                }
            });
        }else{
            callback(400,{'Error':'Cloud not find posts'})
        }
    })
};

// Handlers tokens
handlers.tokens = function(data,callback){
    const acceptableMethods = ['post','get','put','delete'];
    if(acceptableMethods.indexOf(data.method) > -1){
        handlers._tokens[data.method](data,callback);
    }else{
        callback(405);
    }
};

handlers._tokens = {};


// Handlers tokens - post
// Required data - user, password
// Optional data - none
handlers._tokens.post = function(data,callback){
    let user = typeof(data.payload.user) === 'string' && data.payload.user.trim().length > 0 ? data.payload.user.trim() : false;
    let password = typeof(data.payload.password) === 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    if(user && password){
        _data.read('users',user,(err,userData)=>{
            if(!err && userData){
                let hashedPassword = helpers.hash(password);
                if(hashedPassword === userData.password){
                    let tokenId = helpers.createRandomString(20);
                    let expires = Date.now() + 1000 * 60 * 60;
                    let tokenData = {
                        'user' : user,
                        'id' : tokenId,
                        'expires': expires
                    };

                    // Store the token
                    _data.create('tokens',tokenId,tokenData,err=>{
                        if(!err) {
                            callback(200,tokenData);
                        }else{
                            callback(500,{'Error': 'Cloud not create the new token'});
                        }
                    })
                }else{
                    callback(400,{'Error':'Invalid user password'});
                }
            }else{
                callback(400,{'Error':'Cloud not find the user'})
            }
        });
    }else{
        callback(400,{'Error':'Missing required fields'});
    }
};

// Tokens - get
// Required data - id
// Optional data - none
handlers._tokens.get = function(data,callback){
    let id = typeof(data.queryStringObject.id) === 'string' && data.queryStringObject.id.trim().length === 20 ? data.queryStringObject.id.trim() : false;
    if(id){
        _data.read('tokens',id,(err,tokenData)=>{
            if(!err && data){
                callback(200,tokenData)
            }else{
                callback(404);
            }
        });
    }else{
        callback(400,{'Error':'Missing required fields'});
    }
};

// Tokens - put
// Required data - id, extend - true
// Optional data - none
handlers._tokens.put = function(data,callback){
    let id = typeof(data.payload.id) === 'string' && data.payload.id.trim().length === 20 ? data.payload.id.trim() : false;
    let extend = typeof(data.payload.extend) === 'boolean' && data.payload.extend === true ? true : false;
    if(id && extend){
        _data.read('tokens',id,(err,tokenData)=>{
            if(!err && tokenData){
                // Check  to make the sure the token isnt already expired
                if(tokenData.expires > Date.now()){
                    // set the exporation an hour from now
                    tokenData.expires = Date.now() + 1000 * 60 * 60;

                    // Store the new token
                    _data.update('tokens',id,tokenData,err=>{
                        if(!err){
                            callback(200,tokenData);
                        }else{
                            callback(500,{'Error': 'Cloud not update the token expiration'});
                        }
                    })
                }else{
                    callback(400,{'Error':'The token has already expired, and connot be expired'});
                }
            }else{
                callback(400,{'Error' : 'Specified tokens does not exist'});
            }
        });
    }else{
        callback(400,{'Error' : 'Missing required fields'});
    }
};

// Tokens - delete
// Required data - id
handlers._tokens.delete = function(data,callback){
    let id = typeof(data.queryStringObject.id) === 'string' && data.queryStringObject.id.trim().length === 20 ? data.queryStringObject.id.trim() : false;
    if(id){
        _data.read('tokens',id,err=>{
            if(!err){
                _data.delete('tokens',id,err=>{
                    if(!err){
                        callback(200);
                    }else{
                        callback(500,{'Error':'Cloud not delete the specefied token'});
                    }
                });
            }else{
                callback(400,{'Error':'Clound not find the specified token'});
            }
        });
    }else{
        callback(400,{'Error':'Missing required fields'});
    }
};

// Verify the token
handlers._tokens.verifyToken = function(id,user,callback){
    _data.read('tokens',id,(err, tokenData)=>{
        if(!err && tokenData){
            if(tokenData.user === user && tokenData.expires > Date.now()){
                callback(true);
            }else{
                callback(false);
            }
        }else{
            callback(false);
        }
    });
};



// Handler ping
handlers.ping = function(data,callback){
    callback(200);
};

// Page not found
handlers.notFound = function(data,callback){
    callback(404,{'Error': 'Sorry this page not found'});
};



// Export the module
module.exports = handlers;