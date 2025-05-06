export class User {
  id: string;
  name: string;
  email: string;
  password: string;
  refreshToken: string | null;

  setId(id: string) {
    this.id = id;
  }

  setName(name: string) {
    this.name = name;
  }

  setEmail(email: string) {
    this.email = email;
  }

  setPassword(password: string) {
    this.password = password;
  }

  setRefreshToken(refreshToken: string | null) {
    this.refreshToken = refreshToken;
  }
}
