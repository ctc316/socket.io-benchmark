'use strict';

var fs = require('fs');

var fileName = 'result',
      fileDirPath = './output/',
      fileType = '.csv',
      filePath = fileDirPath+fileName+fileType; 


var ensureFolderExists = function (path, mask, cb) {
    if (typeof mask == 'function') { 
        // allow the `mask` parameter to be optional
        cb = mask;
        mask = '0777';
    }
    fs.mkdir(path, mask, function(err) {
        if (err) {
            // ignore the error if the folder already exists
            if (err.code == 'EEXIST') cb(null); 
            // something else went wrong
            else cb(err); 
        } else cb(null); // successfully created folder
    });
}


exports.configPath = function (name, dirpath, type) {
      fileName    = name ? name : fileName;
      fileDirPath = dirpath ? dirpath : fileDirPath;
      fileType    = type ? type : fileType;
      filePath    = fileDirPath+fileName+fileType;
};


exports.createOutputFile = function(data)
{
    ensureFolderExists(fileDirPath, '0744', function(err) {
        if (err) {
           console.error(err);
           return false;
        }
    });
    if(data)
    {
      fs.writeFile(filePath, data, function(err) {
          if(err) {
              console.error(err);
              return false;
          } 
      });
    }
    return true;
};


exports.appendToOutputFile = function(data)
{
    fs.appendFile(filePath, data, function(err) {
        if(err) {
            console.error(err);
            return false;
        } 
    });
    return true;
};






