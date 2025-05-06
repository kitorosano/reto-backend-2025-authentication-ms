import { Logger } from '@nestjs/common';
import environment from '../../config/environment';
import { Log } from './log';

jest.mock('../../config/environment');

jest.mock('@nestjs/common');

const mockLoggerLog = jest.fn();
const mockLoggerError = jest.fn();
const mockLoggerWarn = jest.fn();
const mockLoggerDebug = jest.fn();

describe('Log', () => {
  beforeEach(() => {
    Logger.log = mockLoggerLog;
    Logger.error = mockLoggerError;
    Logger.warn = mockLoggerWarn;
    Logger.debug = mockLoggerDebug;

    environment.name = 'development'; // Simulate a development environment
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ==== Ok ====
  it('should log info messages', () => {
    const instance = { name: 'TestInstance' };
    const message = 'This is an info message';
    const foo = { key: 'value' };

    Log.info(instance, message, foo);

    expect(mockLoggerLog).toHaveBeenCalledWith(
      `[INFO] ${message} ${JSON.stringify(foo, null, 2)}`,
      `${instance.name}`,
    );
  });

  it('should log error messages', () => {
    const instance = { name: 'TestInstance' };
    const message = 'This is an error message';
    const foo = { key: 'value' };

    Log.error(instance, message, foo);

    expect(mockLoggerError).toHaveBeenCalledWith(
      `[ERROR] ${message} ${JSON.stringify(foo, null, 2)}`,
      `${instance.name}`,
    );
  });

  it('should log warn messages', () => {
    const instance = { name: 'TestInstance' };
    const message = 'This is a warn message';
    const foo = { key: 'value' };

    Log.warn(instance, message, foo);

    expect(mockLoggerWarn).toHaveBeenCalledWith(
      `[WARN] ${message} ${JSON.stringify(foo, null, 2)}`,
      `${instance.name}`,
    );
  });

  it('should log debug messages', () => {
    const instance = { name: 'TestInstance' };
    const message = 'This is a debug message';
    const foo = { key: 'value' };

    Log.debug(instance, message, foo);

    expect(mockLoggerDebug).toHaveBeenCalledWith(
      `[DEBUG] ${message} ${JSON.stringify(foo, null, 2)}`,
      `${instance.name}`,
    );
  });

  // ==== No instance.name ====
  it('should log info messages without instance.name or foo', () => {
    const instance = 'TestInstance';
    const message = 'This is an info message';

    Log.info(instance, message);

    expect(mockLoggerLog).toHaveBeenCalledWith(
      `[INFO] ${message}`,
      `${instance}`,
    );
  });

  it('should log error messages without instance.name or foo', () => {
    const instance = 'TestInstance';
    const message = 'This is an error message';

    Log.error(instance, message);

    expect(mockLoggerError).toHaveBeenCalledWith(
      `[ERROR] ${message}`,
      `${instance}`,
    );
  });

  it('should log warn messages without instance.name or foo', () => {
    const instance = 'TestInstance';
    const message = 'This is a warn message';

    Log.warn(instance, message);

    expect(mockLoggerWarn).toHaveBeenCalledWith(
      `[WARN] ${message}`,
      `${instance}`,
    );
  });

  it('should log debug messages without instance.name or foo', () => {
    const instance = 'TestInstance';
    const message = 'This is a debug message';

    Log.debug(instance, message);

    expect(mockLoggerDebug).toHaveBeenCalledWith(
      `[DEBUG] ${message}`,
      `${instance}`,
    );
  });

  // ==== Dont Log ====
  it('should not log info messages', () => {
    environment.name = 'production'; // Simulate a non-development environment

    const instance = { name: 'TestInstance' };
    const message = 'This is an info message';
    const foo = { key: 'value' };

    Log.info(instance, message, foo);

    expect(mockLoggerLog).not.toHaveBeenCalled();
  });

  it('should not log error messages', () => {
    environment.name = 'production'; // Simulate a non-development environment

    const instance = { name: 'TestInstance' };
    const message = 'This is an error message';
    const foo = { key: 'value' };

    Log.error(instance, message, foo);

    expect(mockLoggerError).not.toHaveBeenCalled();
  });

  it('should not log warn messages', () => {
    environment.name = 'production'; // Simulate a non-development environment

    const instance = { name: 'TestInstance' };
    const message = 'This is a warn message';
    const foo = { key: 'value' };

    Log.warn(instance, message, foo);

    expect(mockLoggerWarn).not.toHaveBeenCalled();
  });

  it('should not log debug messages', () => {
    environment.name = 'production'; // Simulate a non-development environment

    const instance = { name: 'TestInstance' };
    const message = 'This is a debug message';
    const foo = { key: 'value' };

    Log.debug(instance, message, foo);

    expect(mockLoggerDebug).not.toHaveBeenCalled();
  });
});
