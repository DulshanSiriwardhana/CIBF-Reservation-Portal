export interface Stall {
  id: number;
  stallName: string;
  size: "SMALL" | "MEDIUM" | "LARGE";
  dimension: number;
  price: number;
  status: "AVAILABLE" | "RESERVED" | "MAINTENANCE";
  reservedBy?: number | string;
  reservationId?: number | string;
  positionX: number;
  positionY: number;
  description?: string;
  genreIds?: number[];
  createdAt?: string;
  updatedAt?: string;
}
