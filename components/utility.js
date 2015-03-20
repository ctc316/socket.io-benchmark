'use strict';


exports.getTimeStamp = function(){
    var now = new Date();
    return  (now.getFullYear() + '/' +
            (now.getMonth() + 1) + '/' +
            (now.getDate()) + " " +
            now.getHours() + ':' +
            ((now.getMinutes() < 10)
                ? ("0" + now.getMinutes())
                : (now.getMinutes())) + ':' +
            ((now.getSeconds() < 10)
                ? ("0" + now.getSeconds())
                : (now.getSeconds())));
};

exports.getTimeStampForHeader = function(){
    var now = new Date();
    return  (now.getFullYear()%100  +  '' +
            ((now.getMonth()+1 < 10)
                ? ("0" + (now.getMonth()+1))
                : (now.getMonth()+1)) + '' +
            ((now.getDate() < 10)
                ? ("0" + now.getDate())
                : (now.getDate())) + '_' +
            ((now.getHours() < 10)
                ? ("0" + now.getHours())
                : (now.getHours())) + '' + 
            ((now.getMinutes() < 10)
                ? ("0" + now.getMinutes())
                : (now.getMinutes())) + '' +
            ((now.getSeconds() < 10)
                ? ("0" + now.getSeconds())
                : (now.getSeconds())));
};

exports.roundNumber = function(num, precision) {
  return parseFloat(Math.round(num * Math.pow(10, precision)) / Math.pow(10, precision));
}




