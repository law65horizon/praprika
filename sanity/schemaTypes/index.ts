import { categorySchema } from "./category";
import { menuItemSchema } from "./menuItem";
import { orderSchema } from "./order";
import { reservationSchema } from "./reservation";
import { packageBookingSchema } from "./packageBooking";
import { eventSchema } from "./event";

export const schemaTypes = [
  categorySchema,
  menuItemSchema,
  orderSchema,
  reservationSchema,
  packageBookingSchema,
  eventSchema,
];
