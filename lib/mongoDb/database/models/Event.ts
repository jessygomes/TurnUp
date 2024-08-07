// import { Document, Schema, model, models } from "mongoose";

export interface IEvent {
  id: string;
  title: string;
  description?: string;
  location?: string;
  departement: string;
  createdAt: Date;
  imageUrl: string;
  startDateTime: Date;
  endDateTime: Date;
  price?: string;
  isFree: boolean;
  url?: string;
  category: { _id: string; name: string };
  organizer: string;
  nbFav?: number;
  Category?: string;
  Organizer?: { id: string; name: string };
}

// const EventSchema = new Schema({
//   title: { type: String, required: true },
//   description: { type: String },
//   location: { type: String },
//   departement: { type: String },
//   createdAt: { type: Date, default: Date.now },
//   imageUrl: { type: String, required: true },
//   startDateTime: { type: Date, default: Date.now },
//   endDateTime: { type: Date, default: Date.now },
//   price: { type: String },
//   isFree: { type: Boolean, default: false },
//   url: { type: String },
//   category: { type: Schema.Types.ObjectId, ref: "Category" },
//   organizer: { type: Schema.Types.ObjectId, ref: "User" },
//   nbFav: { type: Number, default: 0 },
// });

// const Event = models.Event || model("Event", EventSchema);

// export default Event;
