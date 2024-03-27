# Introduction and Overview:

**Live Link**: `https://gyangrove-9jfk.onrender.com/`
**Video Explanation**: `https://youtube.com/coming-soon/`

Welcome to Gyangrove, a robust backend platform for organizing and managing events seamlessly. My project aims to provide developers with a user-friendly and documented API to create and discover various events happening around a particular date. With Gyangrove Event Manager, users can effortlessly explore exciting events, and connect with like-minded individuals. Some of the key features of our platform include:

## Event Creation: 
Users can easily create new events, specifying essential details such as event name, date, time, location, and description.

## Event Discovery: 
Our platform offers a comprehensive event discovery feature, allowing users to explore a wide range of events based on dates.

My project follows a consistent response format across all API endpoints. This standardized format ensures clarity and ease of understanding for both clients consuming our APIs and developers working on the project. Each response includes a `success` flag indicating the outcome of the request, a `statusCode` to identify the HTTP status code, and a `message` providing additional context or error details when applicable. Additionally, where necessary, we include a `data` field containing the payload of the response.

## Backend Security Measures

Ensuring the security of our application is of paramount importance to us. We have implemented several security measures to protect against common vulnerabilities and attacks. These measures include:

- **Helmet Middleware:** I have used the Helmet middleware to set various HTTP headers, such as Content Security Policy (CSP), XSS Protection, and others, to enhance the security of our application.
  
- **CORS Configuration:** Cross-Origin Resource Sharing (CORS) is configured to allow only trusted domains to access our APIs, thereby preventing unauthorized access from potentially malicious sources.
  
- **MongoDB Validator:** MongoDB schema validation is employed to enforce data integrity and ensure that incoming data adheres to predefined schema requirements, reducing the risk of data corruption or injection attacks.

## Custom Error Handlers and Async Error Handling

I have implemented custom error handlers to centralize error management and provide consistent error responses across our application. These error handlers are designed to catch and handle various types of errors, including validation errors, database errors, and unexpected runtime errors. Additionally, we utilize the `catchAsyncError` middleware to handle asynchronous functions and gracefully capture and propagate any errors that occur within these functions, ensuring that our application remains robust and resilient to errors.


## Parallel Fetching of External APIs

Our project employs a strategy of parallel fetching when making requests to external APIs, leveraging the power of promises to enhance performance and reduce response times. This approach allows us to asynchronously fetch data from multiple external sources simultaneously, maximizing efficiency and minimizing the time taken to retrieve required information.

#### Benefits:

- **Improved Performance:** By fetching data from external APIs in parallel, we can significantly reduce the overall latency of our application. This results in faster response times and improved user experience.

- **Efficient Resource Utilization:** Parallel fetching enables us to make the most efficient use of available network resources by sending multiple requests concurrently. This helps prevent bottlenecks and ensures optimal utilization of bandwidth.

- **Enhanced Scalability:** As our application scales to handle larger volumes of requests, the parallel fetching strategy allows us to maintain high performance and responsiveness even under heavy load conditions.

#### Implementation:

I have utilised JavaScript's built-in `Promise.all()` method to orchestrate parallel fetching of external APIs. This method takes an array of promises representing individual API requests and returns a single promise that resolves when all requests are successfully completed or rejects if any request encounters an error.

#### Example:

```typescript
const [weather, distance] = await Promise.all([
  fetchWeather(event.city, event.date),
  calculateDistance(
    parseFloat(latitude.toString()),
    parseFloat(longitude.toString()),
    event.location.coordinates[1],
    event.location.coordinates[0]
  ),
]);
```

In the above example, I concurrently fetch weather data and calculate distances for each event using `Promise.all()`. This ensures that both operations are performed in parallel, maximizing efficiency and reducing overall response times.

 
# Tech Stack Overview

Gyangrove is built using a modern tech stack comprising Node, Express, TypeScript, MongoDB, and Docker. Each component of our tech stack has been carefully selected to ensure scalability, performance, and maintainability. Here's a brief overview of our tech stack:

## Node: 
I chose Node for its non-blocking, event-driven architecture, which makes it well-suited for building scalable and high-performance server-side applications. Node allows us to handle concurrent connections efficiently, ensuring optimal performance even under heavy loads.

## Express: 
Express is a minimalist web framework for Node that provides a robust set of features for building web applications and APIs. It offers middleware support, routing capabilities, and simplified handling of HTTP requests and responses, allowing us to develop APIs quickly and efficiently.

## TypeScript: 
TypeScript is a superset of JavaScript that adds static typing and other advanced features to the language. By using TypeScript, we can catch errors at compile-time, enhance code readability, and improve code maintainability. TypeScript also provides excellent support for modern JavaScript features and enables better tooling and editor support.

## MongoDB: 
MongoDB is a flexible and scalable NoSQL database that offers high performance, scalability, and flexibility. We chose MongoDB for its document-oriented data model, which allows us to store and manage structured and unstructured data efficiently. MongoDB's support for geospatial queries also makes it ideal for handling location-based data, such as event locations.

## Docker:
Docker is used for building & running images. My main motive behind using Docker was to deploy it easily on Render.


# Why I Chose This Tech Stack:

### Scalability: 
Node and MongoDB are both known for their scalability, allowing our application to handle a large number of concurrent users and scale horizontally as our user base grows.

### Developer Productivity: 
The combination of Node.js, Express.js, and TypeScript enables rapid development of APIs with clear and concise code. TypeScript's static typing and advanced tooling enhance developer productivity and reduce the likelihood of runtime errors.

### Community Support: 
Node, Express, TypeScript, and MongoDB are widely adopted technologies with active communities and extensive documentation. This ensures that we have access to a wealth of resources, libraries, and best practices to help us build and maintain our application effectively.


# API Documentation:

### Create Event

- **Description:** This endpoint allows users to create a new event.

- **URL:** `/api/v1/events`

- **Method:** `POST`

- **Request Body:**

```json
{
  "eventName": "Sample Event",
  "city": "Sample City",
  "date": "2024-03-01",
  "time": "10:00 AM",
  "latitude": 40.7128,
  "longitude": -74.0060
}
```

- **Response:**

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Event created successfully",
  "data": {
    "_id": "607a4939a4b4e832b80b8a7d",
    "eventName": "Sample Event",
    "city": "Sample City",
    "date": "2024-03-01",
    "time": "10:00 AM",
    "location": {
      "type": "Point",
      "coordinates": [
        -74.006,
        40.7128
      ]
    }
  }
}
```

### Get Events

- **Description:** This endpoint allows users to retrieve events based on location and date.

- **URL:** `https://gyangrove-9jfk.onrender.com/api/v1/events`

- **Method:** `GET`

- **Query Parameters:**

  - `latitude` (required): Latitude of the user's location.
  - `longitude` (required): Longitude of the user's location.
  - `date` (required): Date in YYYY-MM-DD format.

- **Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Events retrieved successfully",
  "data": {
    "events": [
      {
        "eventName": "Sample Event",
        "city": "Sample City",
        "date": "2024-03-01",
        "weather": "Sunny",
        "distance": 10.5
      },
      {
        "eventName": "Another Event",
        "city": "Another City",
        "date": "2024-03-01",
        "weather": "Cloudy",
        "distance": 15.2
      }
    ],
    "page": 1,
    "pageSize": 10,
    "totalEvents": 2,
    "totalPages": 1
  }
}
```

### Error Responses

- **400 Bad Request:**

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Latitude, longitude, and date are required"
}
```

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Latitude and longitude must be numbers"
}
```

```json
{
  "success": false,
  "statusCode": 400,
  "message": "2024/03/32 is not a valid date format (YYYY-MM-DD)"
}
```

```json
{
  "success": false,
  "statusCode": 400,
  "message": "10:00 AM is not a valid time format (HH:mm:ss)"
}
```

- **500 Internal Server Error:**

```json
{
  "success": false,
  "statusCode": 500,
  "message": "Internal Server Error"
}
```



## Setup Instructions

Follow these steps to set up and run the project locally on your machine:

### Prerequisites

1. **Node.js:** Make sure you have Node.js installed on your system. You can download it from [nodejs.org](https://nodejs.org/).

2. **MongoDB:** Ensure that MongoDB is installed and running on your machine. You can download MongoDB from [mongodb.com](https://www.mongodb.com/).

### Installation

1. Clone the repository to your local machine using the following command:

   ```bash
   git clone https://github.com/olifarhaan/gyangrove.git
   ```

2. Navigate to the project directory:

   ```bash
   cd your-project
   ```

3. Install dependencies using npm or yarn:

   ```bash
   npm install
   # or
   yarn install
   ```

### Configuration

1. Create a `.env` file in the root directory of the project.

2. Add environment variables to the `.env` file as per your configuration requirements. Include variables such as database connection strings, API keys, and any other sensitive information.

   ```plaintext
   PORT=3000
   FRONTEND_BASE_URL=http://localhost:5731 // If you are implementing frontend
   NODE_ENV=development
   MONGODB_URI=mongodb+srv://your-uri.mongodb.net/gyangrove-assignment?retryWrites=true&w=majority

   ```

### Running the Server

1. Start the server using npm or yarn:

   ```bash
   npm start
   # or
   yarn start
   ```

2. Once the server is running, you can access the API endpoints locally at `http://localhost:3000`.


