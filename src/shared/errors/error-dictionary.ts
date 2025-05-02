import { EnDictionary } from './lang/en-dictionary';
import { EsDictionary } from './lang/es-dictionary';

export enum AvailableLanguages {
  EN = 'en',
  ES = 'es',
}

export const ErrorDictionary = {
  [AvailableLanguages.EN]: EnDictionary,
  [AvailableLanguages.ES]: EsDictionary,
};
