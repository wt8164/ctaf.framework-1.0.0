import { Injectable, EventEmitter, Output, OpaqueToken } from '@angular/core';
import { ServiceBase } from './servicebase';

declare var CTAFShell: any;

enum LogType {
    Debug,
    Info,
    Warn,
    Error,
    Fatal
}

export class Log {
    moduleId: string;
    message: string;

    constructor(moduleId: string, message: string) {
        this.moduleId = moduleId;
        this.message = message;
    }
}

// class Logger {
//     type: LogType;
//     log: Log;
//     logType = LogType;
//     stack: any;

//     constructor(type: LogType, log: Log, stack: any) {
//         this.type = type;
//         this.log = log;
//         this.stack = stack;
//     }
// }

@Injectable()
export class LogService extends ServiceBase {
    worker: Worker;

    constructor() {
        super();

        // this.worker = this.run(this.LogWorker);
    }

    public debug(log: Log) {
        // try {
        //     throw new Error('abc');
        // } catch (e) {
        // this.worker.postMessage(new Logger(LogType.Debug, log, null));
        // }

        this.log(LogType.Debug, log);
    }

    public error(log: Log) {
        // try {
        //     throw new Error('abc');
        // } catch (e) {
        // this.worker.postMessage(new Logger(LogType.Error, log, null));
        // }

        this.log(LogType.Error, log);
    }

    public fatal(log: Log) {
        // try {
        //     throw new Error('abc');
        // } catch (e) {
        // this.worker.postMessage(new Logger(LogType.Fatal, log, null));
        // }

        this.log(LogType.Fatal, log);
    }

    public info(log: Log) {
        // try {
        //     throw new Error('abc');
        // } catch (e) {
        // this.worker.postMessage(new Logger(LogType.Info, log, null));
        // }

        this.log(LogType.Info, log);
    }

    public warn(log: Log) {
        // try {
        //     throw new Error('abc');
        // } catch (e) {
        // this.worker.postMessage(new Logger(LogType.Warn, log, null));
        // }

        this.log(LogType.Warn, log);
    }

    private log(type: LogType, log: Log) {
        let logMessage = `${log.moduleId}: ${log.message}`;

        if (typeof CTAFShell !== 'undefined' && !!CTAFShell.Log) {
            CTAFShell.Log.writeLog(type, logMessage);
        } else {
            switch (type) {
                case LogType.Debug:
                    console.debug(logMessage);
                    break;
                case LogType.Error:
                    console.error(logMessage);
                    break;
                case LogType.Fatal:
                    console.exception(logMessage);
                    break;
                case LogType.Info:
                    console.info(logMessage);
                    break;
                case LogType.Warn:
                    console.warn(logMessage);
                    break;
            }
        }
    }

    // private LogWorker(logger: Logger) {
    //     // let logMessage = logger.stack.replace('Error: abc', `${new Date()}(${logger.log.moduleId}): ${logger.log.message}`);
    //     let logMessage = logger.log.message;

    //     if (AppLog !== null) {
    //         AppLog.writeLog(logger.type, logger.log.message);
    //     } else {
    //         switch (logger.type) {
    //             case logger.logType.Debug:
    //                 console.debug(logMessage);
    //                 break;
    //             case logger.logType.Error:
    //                 console.error(logMessage);
    //                 break;
    //             case logger.logType.Fatal:
    //                 console.exception(logMessage);
    //                 break;
    //             case logger.logType.Info:
    //                 console.info(logMessage);
    //                 break;
    //             case logger.logType.Warn:
    //                 console.warn(logMessage);
    //                 break;
    //         }
    //     }
    // }
}
