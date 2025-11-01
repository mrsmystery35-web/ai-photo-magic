
export enum Language {
  AR = 'ar',
  EN = 'en',
}

export enum Tool {
  ENHANCE = 'ENHANCE',
  ANIME = 'ANIME',
  EDIT = 'EDIT',
  BACKGROUND = 'BACKGROUND',
}

export interface ImageFile {
  base64: string;
  mimeType: string;
  url: string;
}

export interface Subscription {
  active: boolean;
  expiryDate: string | null;
}

export interface User {
  name: string;
  email: string;
  subscription?: Subscription;
}
