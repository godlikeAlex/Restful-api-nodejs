// Dependecies 
const fs = require('fs');
const path = require('path');
const helpers = require('./helpers');

// Container for all data functions
let lib = {};
// Base derictory 
lib.baseDir = path.join(__dirname,'/../.data/');

// Create the file
lib.create = function(dir,fileName,data,callback){
    fs.open(lib.baseDir+dir+'/'+fileName+'.json','wx',(err,fileDes)=>{
        if(!err && fileDes){
            // Convert data to string
            let strData = JSON.stringify(data);
            fs.writeFile(fileDes,strData,(err)=>{
                if(!err){
                    fs.close(fileDes,err=>{
                        if(!err){
                            callback(false);
                        }else{
                            callback('Error closing new file')
                        }
                    })
                }else{
                    callback('Error writing in new file')
                }
            })
        }else{
            callback('Cloud not create new file, it may already exist')
        }
    })
};


// Read the file
lib.read = function(dir,fileName,callback){
    fs.readFile(lib.baseDir+dir+'/'+fileName+'.json','utf-8',(err,data)=>{
        if(!err && data){
            let parsedData = helpers.parseJsonToObject(data);
            callback(false,parsedData);
        }else{
            callback(err,data);
        }
    })
};

// Update the file
lib.update = function(dir,fileName,data,callback){
    fs.open(lib.baseDir+dir+'/'+fileName+'.json','r+',(err,fileDescriptor)=>{
        if(!err && fileDescriptor){
            // Convert data to string
            let stringData = JSON.stringify(data);

            // Truncate the file
            fs.truncate(fileDescriptor,err=>{
                if(!err){
                    //write to the file and close it
                    fs.writeFile(fileDescriptor,stringData,err=>{
                        if(!err){
                            fs.close(fileDescriptor,err=>{
                                if(!err){
                                    callback(false);
                                }else{
                                    callback('Error closing the file');
                                }
                            })
                        }
                    });
                }else{
                    callback('Error writing to existing file');
                }
            });
        }else{
            callback('Cloud not open the file for updating,it may not exist yet');
        }
    });
};

// Delete the file
lib.delete = function(dir,fileName,callback){
    fs.unlink(lib.baseDir+dir+'/'+fileName+'.json',err=>{
        if(!err){
            callback(false);
        }else{
            console.log('Error deleting file');
        }
    })
};

// Read all files on the folder
lib.list = function(dir,callback){
    fs.readdir(lib.baseDir+dir+'/',(err,data)=>{
        if(!err && data && data.length > 0){
            let trimmedFileNames = [];
            data.forEach(fileName=>{
                trimmedFileNames.push(fileName.replace('.json',''));
            });
            callback(false,trimmedFileNames);
        }else{
            callback(err,data);
        }
    });
};

// List all data
lib.listData = function(array,dir,callback){
    let newArr = [];
    array.forEach((element,i)=>{
        fs.readFile(lib.baseDir+dir+'/'+element+'.json','utf-8',(err,data)=>{
            if(!err && data){
                newArr.push(helpers.parseJsonToObject(data));
                if(i === array.length -1){
                    callback(false,newArr)
                }
            }else{
                callback('Error reading file');
            }
        })
    });
};

// Export the module
module.exports = lib;