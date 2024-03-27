// src/models/Event.ts

import mongoose, { Schema, Document } from "mongoose";

export interface IEvent extends Document {
  eventName: string;
  city: string;
  date: string;
  time: string;
  location: {
    type: string;
    coordinates: [number, number]; // [longitude, latitude]
  };
}

const EventSchema: Schema<IEvent> = new Schema({
  eventName: { type: String, required: true },
  city: { type: String, required: true },
  date: {
    type: String,
    validate: {
      validator: (value:string)=> /^\d{4}-\d{2}-\d{2}$/.test(value),
      message: (props:any)=> `${props.value} is not a valid date format (YYYY-MM-DD)`,
    },
    required: true,
  },

  time: {
    type: String,
    required: true,
    validate: {
      validator: (value: string) => /^[0-9]{2}:[0-9]{2}:[0-9]{2}$/.test(value),
      message: (props: any) => `${props.value} is not a valid time format (HH:mm:ss)`
    }
  },
  location: {
    type: {
      type: String,
      enum: ["Point"], // It will help in future if we have to add location based events fetching
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
});

EventSchema.index({ date: 1 }); // Index on the 'date' field

export default mongoose.model<IEvent>("Event", EventSchema);
