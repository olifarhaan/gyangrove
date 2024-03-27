// src/controllers/eventController.ts

import { Request, Response, NextFunction } from "express";
import Event, { IEvent } from "../models/eventModel";
import { CustomErrorHandler } from "../utils/CustomErrorHandler";
import { catchAsyncError } from "../middlewares/catchAsyncError";
import mongoose from "mongoose";

export const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
export const timeRegex = /^[0-9]{2}:[0-9]{2}:[0-9]{2}$/;

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

    if (
      isNaN(parseFloat(latitude as string)) ||
      isNaN(parseFloat(longitude as string))
    ) {
      return next(
        new CustomErrorHandler(400, "Latitude and longitude must be numbers")
      );
    }

    if (!dateRegex.test(date as string)) {
      return next(
        new CustomErrorHandler(
          400,
          "Date format must be YYYY-MM-DD (e.g., 2024-03-01)"
        )
      );
    }

    try {
      const endDate = new Date(date as string);
      endDate.setDate(endDate.getDate() + 14);

      const eventsCount = await Event.countDocuments({
        date: {
          $gte: date as string,
          $lte: endDate.toISOString().split("T")[0],
        },
      });

      const totalPages = Math.ceil(eventsCount / pageSize);
      const events: IEvent[] = await Event.find({
        date: {
          $gte: date as string,
          $lte: endDate.toISOString().split("T")[0],
        },
      })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .sort({ date: 1 });

      // Fetch weather and calculate distance for each event
      const eventsWithDetails = await Promise.all(
        events.map(async (event) => {
          const [weather, distance] = await Promise.all([
            fetchWeather(event.city, event.date),
            calculateDistance(
              parseFloat(latitude.toString()),
              parseFloat(longitude.toString()),
              event.location.coordinates[1],
              event.location.coordinates[0]
            ),
          ]);
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

const fetchWeather = async (city: string, date: string): Promise<string> => {
  try {
    const response = await fetch(
      `https://gg-backend-assignment.azurewebsites.net/api/Weather?code=KfQnTWHJbg1giyB_Q9Ih3Xu3L9QOBDTuU5zwqVikZepCAzFut3rqsg==&city=${encodeURIComponent(
        city
      )}&date=${date}`
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
    const { eventName, city, date, time, latitude, longitude } = req.body;

    try {
      // Validate request body
      if (!eventName || !city || !date || !time || !latitude || !longitude) {
        return next(new CustomErrorHandler(400, "All fields are required"));
      }

      if (
        isNaN(parseFloat(latitude as string)) ||
        isNaN(parseFloat(longitude as string))
      ) {
        return next(
          new CustomErrorHandler(400, "Latitude and longitude must be numbers")
        );
      }

      if (!dateRegex.test(date as string)) {
        return next(
          new CustomErrorHandler(
            400,
            `${date} is not a valid date format (YYYY-MM-DD)`
          )
        );
      }

      if (!timeRegex.test(time as string)) {
        return next(
          new CustomErrorHandler(
            400,
            `${time} is not a valid time format (HH:mm:ss)`
          )
        );
      }

      // Create new event document
      const event: IEvent = new Event({
        _id: new mongoose.Types.ObjectId(), // Generate a new ObjectId
        eventName,
        city,
        date,
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
