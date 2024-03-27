// src/controllers/eventController.ts

import { Request, Response, NextFunction } from "express";
import Event, { IEvent } from "../models/eventModel";
import { CustomErrorHandler } from "../utils/CustomErrorHandler";
import { catchAsyncError } from "../middlewares/catchAsyncError";
import mongoose from "mongoose";

const getEventsController = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      latitude,
      longitude,
      date,
      pageString = 1,
      pageSizeString = 10,
    } = req.query;
    const page = parseInt(pageString as string, 10);
    const pageSize = parseInt(pageSizeString as string, 10);

    // Validate latitude, longitude, and date
    if (!latitude || !longitude || !date) {
      return next(
        new CustomErrorHandler(
          400,
          "Latitude, longitude, and date are required"
        )
      );
    }

    try {
      const eventsCount = await Event.countDocuments({
        date: {
          $gte: new Date(date as string),
          $lte: new Date(
            new Date(date as string).setDate(
              new Date(date as string).getDate() + 14
            )
          ),
        },
      });

      const totalPages = Math.ceil(eventsCount / pageSize);
      const events: IEvent[] = await Event.find({
        date: {
          $gte: new Date(date as string),
          $lte: new Date(
            new Date(date as string).setDate(
              new Date(date as string).getDate() + 14
            )
          ),
        },
      })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .sort({ date: 1 });

      // Fetch weather and calculate distance for each event
      const eventsWithDetails = await Promise.all(
        events.map(async (event) => {
          const weather = await fetchWeather(event.city, event.date);
          const distance = await calculateDistance(
            parseFloat(latitude.toString()),
            parseFloat(longitude.toString()),
            event.location.coordinates[1],
            event.location.coordinates[0]
          );
          return {
            eventName: event.eventName,
            city: event.city,
            date: event.date,
            weather,
            distance,
          };
        })
      );

      res.status(200).jsonResponse(true, 200, "Events retrieved successfully", {
        events: eventsWithDetails,
        page,
        pageSize,
        totalEvents: eventsCount,
        totalPages,
      });
    } catch (error) {
      next(error);
    }
  }
);

const fetchWeather = async (city: string, date: Date): Promise<string> => {
  try {
    const response = await fetch(
      `https://gg-backend-assignment.azurewebsites.net/api/Weather?code=KfQnTWHJbg1giyB_Q9Ih3Xu3L9QOBDTuU5zwqVikZepCAzFut3rqsg==&city=${encodeURIComponent(
        city
      )}&date=${date.toISOString().split("T")[0]}`
    );
    const data = await response.json();
    return data.weather;
  } catch (error) {
    console.error("Error fetching weather:", error);
    return "Unknown"; // Default to 'Unknown' in case of error
  }
};

const calculateDistance = async (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): Promise<number> => {
  try {
    const response = await fetch(
      `https://gg-backend-assignment.azurewebsites.net/api/Distance?code=IAKvV2EvJa6Z6dEIUqqd7yGAu7IZ8gaH-a0QO6btjRc1AzFu8Y3IcQ==&latitude1=${lat1}&longitude1=${lon1}&latitude2=${lat2}&longitude2=${lon2}`
    );
    const data = await response.json();
    return data.distance;
  } catch (error) {
    console.error("Error calculating distance:", error);
    return -1; // Default to -1 in case of error
  }
};

const createEventController = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("first");
    const { eventName, city, date, time, latitude, longitude } = req.body;

    try {
      // Validate request body
      if (!eventName || !city || !date || !time || !latitude || !longitude) {
        return next(new CustomErrorHandler(400, "All fields are required"));
      }

      // Create new event document
      const event: IEvent = new Event({
        _id: new mongoose.Types.ObjectId(), // Generate a new ObjectId
        eventName,
        city,
        date: new Date(date),
        time,
        location: {
          type: "Point",
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
        },
      });

      // Save event to MongoDB
      await event.save();

      res
        .status(201)
        .jsonResponse(true, 201, "Event created successfully", event);
    } catch (error) {
      next(error);
    }
  }
);

export { getEventsController, createEventController };
