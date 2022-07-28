import { AxiosRequestHeaders } from 'axios';
import Token from '@utils/token';

class Constants {
  public API_TIMEOUT = 15000;

  public API_HEADERS = {
    'Content-type': 'application/json',
    'X-Api-Key': process.env.NEXT_PUBLIC_API_KEY as string
  };

  public authHeader = (): AxiosRequestHeaders => {
    const accessToken = Token.getToken()?.accessToken;
    if (accessToken) {
      return {
        'Content-type': 'application/json',
        'X-Api-Key': process.env.NEXT_PUBLIC_API_KEY as string,
        'Authorization': `Bearer ${accessToken}`
      };
    }
    return {};
  };

  public authHeaderMultiPart = (): AxiosRequestHeaders => {
    const accessToken = Token.getToken()?.accessToken;
    if (accessToken) {
      return {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
        'X-Api-Key': process.env.NEXT_PUBLIC_API_KEY as string,
        'Authorization': `Bearer ${accessToken}`
      };
    }
    return {};
  };

}

export default new Constants();
