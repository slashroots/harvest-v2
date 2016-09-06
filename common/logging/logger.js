/**
* @desc implementation of winston.js
* @author Christopher Lee Murray lee.christopher.murray@gmail.com
**/

var winston = require('winston');
winston.emitErrs = true;
const moment = require('moment');
var MongoDB = require('winston-mongo').Mongo;


function formatter(args) {
    var date = moment().format("YYYY/MM/DD.HH:mm:ss");
    
    var msg = '\n\n==============\n---ACTIVITY---\n==============\n'        +
              '\tdate: '    + date         + '\n'                           + 
              '\tlevel: '   + args.level   + '\n'                           + 
              '\tmessage: ' + args.message + '\n\t' + JSON.stringify(args.meta, null, 4);
        
    return msg;
}

var ConfigLevels = {
    levels: {
        emerg: 0,
        alert: 1,
        crit: 2,
        error: 3,
        warning: 4,
        notice: 5,
        info: 6,
        debug: 7 
    }
};

var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            level: 'debug',
            json: false,
            eol: '\n',
            colorize: true,
            handleExceptions: true,
            prettyPrint: true,
            formatter: formatter
        }),
        new (winston.transports.File)({
            name: 'logs',
            filename: 'logs.log',
            level: 'debug',
            json: false,
            eol: '\n', // FOR WINDOWS, OR `EOL: ‘N’,` FOR *NIX OSS
            timestamp: true,
            handleExceptions: true,
            prettyPrint: true,
            formatter: formatter
        }),
        new(winston.transports.MongoDB)({
            db : 'mongodb://localhost:27017/mongodb',
            collection: 'logs'
        })
    ],
    exitOnError: false
});


logger.setLevels(ConfigLevels.levels)
//test log messages 
logger.log('info', 'Hello log files!');
logger.info('Hello again log files!');

module.exports = logger;
module.exports.stream = {
    write: function(message, encoding){
        logger.info(message);
    }
};
