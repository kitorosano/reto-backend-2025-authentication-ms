export type PersistenceDrivers = 'mongodb';
export type AuthDrivers = 'jwt';

export interface ApplicationBootstrapOptions {
  persistenceDriver: PersistenceDrivers;
  authDriver: AuthDrivers;
}
