import fs from "fs";
import csvParse from "csv-parse";
import Event from "../models/eventModel";

export const parseCSVAndInsertToMongoDB = async (filePath: string) => {
  try {
    // Read CSV file
    const parser = fs
      .createReadStream(filePath)
      .pipe(csvParse.parse({ columns: true }));
    // Parse each row of the CSV file
    parser.on("data", async (row) => {
      // Create new event document
      const event = new Event({
        eventName: row.event_name,
        city: row.city_name,
        date: row.date,
        time: row.time,
        location: {
          type: "Point",
          coordinates: [parseFloat(row.longitude), parseFloat(row.latitude)],
        },
      });

      // Save event to MongoDB
      await event.save();
      console.log(`Event '${event.eventName}' saved to MongoDB`);
    });

    parser.on("end", () => {
      console.log("Finished parsing CSV file");
    });
  } catch (error) {
    console.error("Error inserting data to MongoDB:", error);
  }
};

// Call the function with the path to your CSV file
