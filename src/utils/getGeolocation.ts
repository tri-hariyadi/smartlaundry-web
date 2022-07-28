interface IError {
  code: number,
  message: string
}

interface Position {
  coords: {
    accuracy: number,
    altitude: number | null,
    altitudeAccuracy: number | null,
    heading: number | null,
    latitude: number,
    longitude: number,
    speed: number | null
  },
  timestamp: number
}

export interface ILocation {
  loaded: boolean,
  coordinates: { lat: number, lng: number },
  error: {
    code: number,
    message: string
  }
}

const getGeolocation = () => {
  const location: ILocation = {
    loaded: false,
    coordinates: { lat: 0, lng: 0 },
    error: {
      code: 0,
      message: ''
    }
  };

  return new Promise((resolve: (_value: ILocation) => void) => {
    if (typeof navigator !== 'undefined') {
      navigator.geolocation.getCurrentPosition(
        (loc: Position) => {
          location.loaded = true;
          location.coordinates = {
            lat: loc.coords.latitude,
            lng: loc.coords.longitude,
          };
          resolve(location);
        },
        (error: IError) => {
          location.loaded = true;
          location.error = {
            code: error.code,
            message: error.message,
          };
          resolve(location);
        });
    }
    else resolve(location);
  });
};

export default getGeolocation;
