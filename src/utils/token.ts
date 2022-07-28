import jwtDecode, { JwtPayload } from 'jwt-decode';
import moment from 'moment';

interface IToken {
  accessToken: string;
  refreshToken: string
}

class Token {
  public tokenDecode(): {
  token?: IToken;
  exp?: Date;
  iss?: string | undefined;
  sub?: string | undefined;
  aud?: string | string[] | undefined;
  nbf?: number | undefined;
  iat?: number | undefined;
  jti?: string | undefined;
  error?: boolean;
  } {
    const token: IToken = this.getToken() as IToken;
    const dataTokenDecoded = {
      token: undefined,
      exp: undefined,
      iss: undefined,
      sub: undefined,
      aud: undefined,
      nbf: undefined,
      iat: undefined,
      jti: undefined,
      error: false,
    };
    if (!token || !token.accessToken) return {
      ...dataTokenDecoded,
      error: true,
    };
    try {
      const profile: JwtPayload = jwtDecode(token.accessToken);
      const { exp } = profile;
      if (exp && exp > moment().unix())
        return {
          ...profile,
          token,
          exp: new Date(exp),
        };
      return { ...dataTokenDecoded, error: true };
    } catch (error) {
      return { ...dataTokenDecoded, error: true };
    }
  }

  public checkExpirity(token: string): boolean {
    if (!token) return false;
    try {
      const profile: JwtPayload = jwtDecode(token);
      const { exp } = profile;
      if (exp && exp > moment().unix()) return true;
      return false;
    } catch (error) {
      return false;
    }
  }

  public setToken(dataToken: IToken, option: 'local' | 'session') {
    if (option === 'local') {
      window.localStorage.setItem('accessToken', dataToken.accessToken);
      window.localStorage.setItem('refreshToken', dataToken.refreshToken);
    } else if (option === 'session') {
      window.sessionStorage.setItem('accessToken', dataToken.accessToken);
      window.sessionStorage.setItem('refreshToken', dataToken.refreshToken);
    }
  }

  public getToken() {
    const payload1 = {
      accessToken: window.localStorage.getItem('accessToken'),
      refreshToken: window.localStorage.getItem('refreshToken')
    };
    const payload2 = {
      accessToken: window.sessionStorage.getItem('accessToken'),
      refreshToken: window.sessionStorage.getItem('refreshToken')
    };
    if (payload1.accessToken && payload1.refreshToken)
      return (payload1);
    if (payload2.accessToken && payload2.refreshToken)
      return (payload2);
  }

  public removeToken() {
    window.sessionStorage.removeItem('accessToken');
    window.sessionStorage.removeItem('refreshToken');
    window.localStorage.removeItem('accessToken');
    window.localStorage.removeItem('refreshToken');
  }

  public isAuth() {
    const token = this.getToken()?.accessToken;
    if (token) return this.checkExpirity(token);
    else return false;
  }
}

export default new Token();
