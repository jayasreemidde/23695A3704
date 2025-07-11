export interface ShortenedUrl {
  id: string;
  originalUrl: string;
  shortCode: string;
  validityMinutes: number;
  createdAt: Date;
  expiresAt: Date;
  clicks: ClickData[];
}

export interface ClickData {
  timestamp: Date;
  source: string;
  location: string;
}

export interface UrlFormData {
  originalUrl: string;
  validityMinutes: number;
  customShortcode?: string;
}
