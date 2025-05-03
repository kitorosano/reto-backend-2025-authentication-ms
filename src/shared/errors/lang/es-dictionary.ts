import { ErrorCodesKeys, ExceptionTypeKeys } from '../error-code-keys.enum';

const UNIMPLEMENTED_MESSAGE = 'Error no conocido';
const UNIMPLEMENTED_DETAIL =
  'Error no implementado en el diccionario de errores';

export const EsDictionary = {
  [ExceptionTypeKeys.UNEXPECTED]: {
    [ErrorCodesKeys.UNIMPLEMENTED]: {
      message: UNIMPLEMENTED_MESSAGE,
      detail: UNIMPLEMENTED_DETAIL,
    },
    [ErrorCodesKeys.REPOSITORY_UNEXPECTED]: {
      message: 'Error inesperado en el acceso a datos',
      detail: 'Ocurrió un error inesperado en el repositorio',
    },
    [ErrorCodesKeys.TOKEN_GENERATION_FAILED]: {
      message: 'Error al generar el token',
      detail: 'Ocurrió un error al generar el token de acceso',
    },
  },
  [ExceptionTypeKeys.BAD_MODEL]: {
    [ErrorCodesKeys.REQUEST_NOT_VALID]: {
      message: 'La solicitud no es válida',
      detail: 'La solicitud no cumple con los requisitos necesarios',
    },
    [ErrorCodesKeys.ID_FORMAT_NOT_VALID]: {
      message: 'El formato del ID no es válido',
      detail: 'El ID debe ser un UUID válido',
    },
    [ErrorCodesKeys.NAME_TOO_LONG]: {
      message: 'El nombre es demasiado largo',
      detail: 'El nombre no puede exceder los 20 caracteres',
    },
    [ErrorCodesKeys.EMAIL_FORMAT_NOT_VALID]: {
      message: 'El formato del correo electrónico no es válido',
      detail: 'El correo electrónico debe tener un formato válido',
    },
    [ErrorCodesKeys.PASSWORD_TOO_SHORT]: {
      message: 'La contraseña es demasiado corta',
      detail: 'La contraseña debe tener al menos 6 caracteres',
    },
    [ErrorCodesKeys.PASSWORDS_NOT_MATCH]: {
      message: 'Las contraseñas no coinciden',
      detail:
        'La contraseña de confirmación debe coincidir con la contraseña original',
    },
    [ErrorCodesKeys.USER_ALREADY_EXISTS]: {
      message: 'El usuario ya existe',
      detail: 'Ya existe un usuario con el correo electrónico proporcionado',
    },
    [ErrorCodesKeys.PASSWORD_INCORRECT]: {
      message: 'Contraseña incorrecta',
      detail: 'La contraseña proporcionada no es correcta',
    },
  },
  [ExceptionTypeKeys.NOT_FOUND]: {
    [ErrorCodesKeys.USER_NOT_FOUND]: {
      message: 'Usuario no encontrado',
      detail:
        'No se encontró el usuario con el correo electrónico proporcionado',
    },
  },
  [ExceptionTypeKeys.INVALID_PERMISSIONS]: {},
};
