export interface Reservation {
  reservationId: string;
  userId: string;
  stallId: string | number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  reserveDate?: string | Date;
  reserveConfirmDate?: string | Date;
  reserveCancelDate?: string | Date;
  email?: string;
  amount?: number;
  vendorName?: string;
  stallName?: string;
  businessName?: string;
}

