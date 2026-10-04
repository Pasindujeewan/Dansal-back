# Dansal Finder – Backend

The backend API for **Dansal Finder**, a location-based mobile application designed to help users discover and share Dansal locations across Sri Lanka during Vesak and Poya seasons.

Built with Node.js, Express.js, and MongoDB, the backend provides secure authentication, geospatial queries, image uploads, and efficient location synchronization.

## Features

* **Authentication:** JWT-based authentication for secure access to protected endpoints.
* **Geospatial Queries:** Uses MongoDB geospatial indexing to find nearby Dansal locations.
* **Tile-Based Fetching:** Retrieves location data based on map boundaries to minimize unnecessary data transfer.
* **Incremental Synchronization:** Supports fetching updated records using timestamps and identifiers.
* **Dansal Management:** Create and retrieve Dansal locations.
* **Image Uploads:** Integrates Cloudinary for image storage.
* **Input Validation:** Validates incoming API requests.
* **Efficient Location Search:** Supports distance-based and map-boundary-based location queries.

## Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* JSON Web Token (JWT)
* Cloudinary
* Multer
* dotenv

## Getting Started

### Prerequisites

* Node.js
* pnpm
* MongoDB Atlas account or local MongoDB
* Cloudinary account

### Installation

Clone the repository:

```bash
git clone YOUR_REPOSITORY_URL
```

Navigate to the project directory:

```bash
cd dansal-backend
```

Install dependencies:

```bash
pnpm install
```

### Environment Variables

Create a `.env` file in the root directory.

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Never commit your `.env` file or expose your credentials publicly.

### Run the Server

Development:

```bash
pnpm dev
```

Production:

```bash
pnpm start
```

The API runs at:

```text
http://localhost:3000
```

## Project Structure

```text
dansal-backend/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── app.js
├── .env
├── .gitignore
├── package.json
└── README.md
```

*Adjust this structure to match your actual backend implementation.*

## API Overview

| Method | Endpoint              | Description                         |
| ------ | --------------------- | ----------------------------------- |
| POST   | `/api/auth/register`  | Register a new user                 |
| POST   | `/api/auth/login`     | Authenticate a user                 |
| GET    | `/api/dansals`        | Retrieve Dansal locations           |
| POST   | `/api/dansals`        | Create a Dansal location            |
| GET    | `/api/dansals/nearby` | Find nearby Dansals                 |
| GET    | `/api/dansals/tiles`  | Retrieve locations within map tiles |

These are illustrative endpoint names. Update them to match your actual API routes.

## Geospatial Data Handling

MongoDB geospatial indexing enables efficient location-based queries.

### 2dsphere Index

Dansal locations use GeoJSON coordinates and a `2dsphere` index to support geospatial operations.

Example:

```js
{
  type: "Point",
  coordinates: [longitude, latitude]
}
```

### Nearby Search

The backend can use MongoDB geospatial operators such as `$near` and `$geoWithin` to find locations based on distance or geographic boundaries.

### Tile-Based Fetching

The tile-based fetching system helps reduce unnecessary data retrieval when users explore the map.

* Receives geographic boundaries.
* Retrieves relevant Dansal locations within those boundaries.
* Supports tile synchronization.
* Uses update timestamps and identifiers to retrieve changed records.

## Image Uploads

Cloudinary is used to store uploaded Dansal images.

Multer handles incoming multipart form data, while Cloudinary manages image storage and delivery.

## Authentication

JWT is used to authenticate users and protect restricted API endpoints.

Protected routes validate access tokens before allowing users to perform authorized operations, such as submitting Dansal locations.

## Future Improvements

* Push notifications for nearby Dansals.
* More advanced caching for geospatial queries.
* Improved API rate limiting.
* Better monitoring and logging.
* Additional automated integration tests.

## Contributing

Contributions, suggestions, and bug reports are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Open a pull request.

## License

Add your preferred license if you intend to distribute the project publicly.
