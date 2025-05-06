import { Logger } from '@nestjs/common';

import environment from '../../config/environment';

export class Log {
  static info(instace: any, message: string, foo?: any): void {
    if (environment.name !== 'development') return;

    const json = foo ? `${JSON.stringify(foo, null, 2)}` : '';
    const name = instace.name || instace;
    Logger.log(`[INFO] ${message} ${json}`, `${name}`);
  }

  static error(instace: any, message: string, foo?: any): void {
    if (environment.name !== 'development') return;

    const json = foo ? `${JSON.stringify(foo, null, 2)}` : '';
    const name = instace.name || instace;
    Logger.error(`[ERROR] ${message} ${json}`, `${name}`);
  }

  static warn(instace: any, message: string, foo?: any): void {
    if (environment.name !== 'development') return;

    const json = foo ? `${JSON.stringify(foo, null, 2)}` : '';
    const name = instace.name || instace;
    Logger.warn(`[WARN] ${message} ${json}`, `${name}`);
  }

  static debug(instace: any, message: string, foo?: any): void {
    if (environment.name !== 'development') return;

    const json = foo ? `${JSON.stringify(foo, null, 2)}` : '';
    const name = instace.name || instace;
    Logger.debug(`[DEBUG] ${message} ${json}`, `${name}`);
  }
}
