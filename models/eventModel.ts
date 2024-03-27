// src/models/Event.ts

import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  eventName: string;
  city: string;
  date: Date;
  time: string;
  location: {
    type: string;
    coordinates: [number, number]; // [longitude, latitude]
  };
}

const EventSchema: Schema<IEvent> = new Schema({
  eventName: { type: String, required: true },
  city: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }
});

EventSchema.index({ location: '2dsphere' }); // Index for geospatial queries

export default mongoose.model<IEvent>('Event', EventSchema);
