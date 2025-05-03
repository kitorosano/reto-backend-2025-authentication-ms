export enum ExceptionTypeKeys {
  BAD_MODEL = 'BadModelException',
  INVALID_PERMISSIONS = 'InvalidPermissionsException',
  NOT_FOUND = 'NotFoundException',
  UNEXPECTED = 'UnexpectedException',
}

export enum ErrorCodesKeys {
  UNIMPLEMENTED = 'TST000',

  // ...
  REPOSITORY_UNEXPECTED = 'TST010',

  REQUEST_NOT_VALID = 'TST020',
  ID_FORMAT_NOT_VALID = 'TST021',
  NAME_TOO_LONG = 'TST022',
  EMAIL_FORMAT_NOT_VALID = 'TST023',
  PASSWORD_TOO_SHORT = 'TST024',
  CONFIRM_PASSWORD_NOT_MATCH = 'TST025',
  USER_ALREADY_EXISTS = 'TST026',

  USER_NOT_FOUND = 'TST030',
  
}