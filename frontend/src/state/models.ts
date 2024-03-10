export interface Observation {
  id: string;
  speciesName: string;
  isEnvasive: boolean;
  isPrecarious: boolean;
  imageUrl: string;
  date: Date;
  location: GeoLocation;
  region: string;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
}
