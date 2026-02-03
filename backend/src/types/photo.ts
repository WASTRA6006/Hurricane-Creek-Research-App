export type PhotoStatus = "active" | "hidden";

export type Photo = {
  id: number;
  zoneId: number;
  category: string;
  description?: string;
  gpsAllowed: boolean;
  lat?: number;
  lng?: number;
  createdAt: string;
  status: PhotoStatus;
};
