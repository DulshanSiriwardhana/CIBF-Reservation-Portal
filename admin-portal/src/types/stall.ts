export interface Stall {
  id: number;
  stallName: string;
  size: "SMALL" | "MEDIUM" | "LARGE";
  dimension: number;
  price: number;
  status: "AVAILABLE" | "RESERVED" | "MAINTENANCE";
  reservedBy?: string;
  reservationId?: string;
  positionX: number;
  positionY: number;
  genreIds?: number[];
}
