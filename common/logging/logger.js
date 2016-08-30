var winston = require('winston');
winston.emitErrs = true;
const moment = require('moment');


function formatter(args) {
    var date = moment().format("YYYY/MM/DD.HH:mm:ss");
    var msg = date         + ' - '   + 
        args.level   + ' - '   + 
        args.message + ' - \n' + JSON.stringify(args.meta, null, 4);
    return msg;
}

var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            level: 'info',
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
            level: 'info',
            json: false,
            eol: '\n', // FOR WINDOWS, OR `EOL: ‘N’,` FOR *NIX OSS
            timestamp: true,
            handleExceptions: true,
            prettyPrint: true,
            formatter: formatter
        })
    ],
    exitOnError: false
});


//test log messages
logger.log('info', 'Hello log files!');
logger.info('Hello again log files!');

module.exports = logger;
module.exports.stream = {
    write: function(message, encoding){
        logger.info(message);
    }
};