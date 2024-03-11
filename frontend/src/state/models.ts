export interface Observation {
  observationId: string;
  speciesName: string;
  isInvasive: boolean;
  isPrecarious: boolean;
  source: string;
  imageUrl: string;
  date: Date;
  geoLocation: GeoLocation;
  location: string;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
}

export interface Species {
  speciesId: string;
  speciesName: string;
}
