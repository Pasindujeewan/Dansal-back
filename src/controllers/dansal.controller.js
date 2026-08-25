import Dansal from "../models/dansal.model.js";
import ApiError from "../utils/api-error.js";
import ApiResponse from "../utils/api-response.js";

//
const MAP_TILE_SIZE_DEGREES = 0.02;
const MAX_TILES_PER_REQUEST = 100;

const getMarkerVersion = (dansal) => {
  return dansal.updatedAt ?? dansal._id.getTimestamp?.() ?? new Date(0);
};

const formatDansalMarker = (dansal) => ({
  id: dansal._id.toString(),
  type: dansal.type,
  location: dansal.location.coordinates,
  updatedAt: getMarkerVersion(dansal).toISOString(),
});

const formatOwnedDansal = (dansal) => ({
  id: dansal._id,
  type: dansal.type,
  description: dansal.description,
  imageUrl: dansal.imageUrl,
  location: dansal.location.coordinates,
  queueLength: dansal.queueLength,
  createdBy: dansal.createdBy.toString(),
});

const parseRequestedTiles = (tiles = "") => {
  if (!tiles) {
    return [];
  }

  return tiles
    .split(",")
    .map((tileKey) => tileKey.trim())
    .filter((tileKey) => /^-?\d+:-?\d+$/.test(tileKey));
};

const parseTileSyncTimes = (tileSync = "") => {
  const syncTimes = new Map();

  if (!tileSync) {
    return syncTimes;
  }

  tileSync
    .split(",")
    .map((tile) => tile.trim())
    .forEach((tile) => {
      const [tileKey, syncedAt] = tile.split("|");
      const syncDate = new Date(syncedAt);

      if (/^-?\d+:-?\d+$/.test(tileKey) && !Number.isNaN(syncDate.getTime())) {
        syncTimes.set(tileKey, syncDate);
      }
    });

  return syncTimes;
};

const getTileBounds = (tileKey) => {
  const [x, y] = tileKey.split(":").map(Number);
  const west = x * MAP_TILE_SIZE_DEGREES - 180;
  const south = y * MAP_TILE_SIZE_DEGREES - 90;

  return {
    west,
    south,
    east: west + MAP_TILE_SIZE_DEGREES,
    north: south + MAP_TILE_SIZE_DEGREES,
  };
};

const getTileKeyForCoordinates = ([longitude, latitude]) => {
  const x = Math.floor((longitude + 180) / MAP_TILE_SIZE_DEGREES);
  const y = Math.floor((latitude + 90) / MAP_TILE_SIZE_DEGREES);

  return `${x}:${y}`;
};

const buildTileQuery = (tileKeys) => ({
  $or: tileKeys.map((tileKey) => {
    const { west, south, east, north } = getTileBounds(tileKey);

    return {
      location: {
        $geoWithin: {
          $box: [
            [west, south],
            [east, north],
          ],
        },
      },
    };
  }),
});

const buildBoundsQuery = ({
  northBound,
  southBound,
  eastBound,
  westBound,
}) => ({
  location: {
    $geoWithin: {
      $box: [
        [westBound, southBound],
        [eastBound, northBound],
      ],
    },
  },
});

const shouldSendDansalForTile = (dansal, tileSyncTimes) => {
  const tileKey = getTileKeyForCoordinates(dansal.location.coordinates);
  const tileSyncedAt = tileSyncTimes.get(tileKey);

  return !tileSyncedAt || getMarkerVersion(dansal) > tileSyncedAt;
};

export const createDansal = async (req, res, next) => {
  try {
    const { description, type, queueLength, imageUrl, coordinates } = req.body;

    if (!Array.isArray(coordinates) || coordinates.length !== 2) {
      return next(
        new ApiError(
          400,
          "Coordinates must be [longitude, latitude]",
          "INVALID_COORDINATES",
        ),
      );
    }

    await Dansal.create({
      description,
      type,
      queueLength,
      imageUrl,
      location: {
        type: "Point",
        // GeoJSON stores coordinates as [longitude, latitude].
        coordinates: [coordinates[0], coordinates[1]],
      },
      createdBy: req.user.userId,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, null, "Dansal added successfully"));
  } catch (error) {
    console.error(error);
    return next(
      new ApiError(500, "Failed to add dansal", "CREATE_DANSAL_ERROR"),
    );
  }
};

export const getDansalsInBounds = async (req, res, next) => {
  try {
    const { north, south, east, west, tiles, tileSync } = req.query;
    const tileKeys = parseRequestedTiles(tiles);
    const tileSyncTimes = parseTileSyncTimes(tileSync);
    const syncedAt = new Date().toISOString();

    if (tileKeys.length > MAX_TILES_PER_REQUEST) {
      return next(
        new ApiError(
          400,
          `A single request can include at most ${MAX_TILES_PER_REQUEST} tiles`,
          "TOO_MANY_MAP_TILES",
        ),
      );
    }

    if (tileKeys.length > 0) {
      const dansals = await Dansal.find(buildTileQuery(tileKeys))
        .select("location type updatedAt")
        .lean();

      const changedDansals = dansals.filter((dansal) =>
        shouldSendDansalForTile(dansal, tileSyncTimes),
      );

      return res.status(200).json(
        new ApiResponse(
          200,
          {
            dansals: changedDansals.map(formatDansalMarker),
            syncedTiles: tileKeys.map((tileKey) => ({ tileKey, syncedAt })),
          },
          "Dansals fetched successfully",
        ),
      );
    }

    const bounds = [north, south, east, west].map(Number);

    if (bounds.some(Number.isNaN)) {
      return next(
        new ApiError(
          400,
          "north, south, east, and west query values are required",
          "INVALID_MAP_BOUNDS",
        ),
      );
    }

    const [northBound, southBound, eastBound, westBound] = bounds;
    const dansals = await Dansal.find(
      buildBoundsQuery({ northBound, southBound, eastBound, westBound }),
    )
      .select("location type updatedAt")
      .lean();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { dansals: dansals.map(formatDansalMarker), syncedTiles: [] },
          "Dansals fetched successfully",
        ),
      );
  } catch (error) {
    console.error(error);
    return next(
      new ApiError(500, "Failed to fetch dansals", "FETCH_DANSALS_ERROR"),
    );
  }
};

export const getDansalById = async (req, res, next) => {
  try {
    const { dansalId } = req.params;
    const dansal = await Dansal.findById(dansalId).select("-type");

    if (!dansal) {
      return next(new ApiError(404, "Dansal not found", "DANSAL_NOT_FOUND"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, { dansal }, "Dansals fetched successfully"));
  } catch (error) {
    console.error(error);
    return next(
      new ApiError(500, "Failed to fetch dansal", "FETCH_DANSAL_ERROR"),
    );
  }
};

export const getUserDansals = async (userId) => {
  const dansals = await Dansal.find({ createdBy: userId }).select(
    "description imageUrl type location queueLength createdBy",
  );

  return dansals.map(formatOwnedDansal);
};

export const searchDansals = async (req, res, next) => {
  try {
    const { type, distance, latitude, longitude } = req.query;
    const dansals = await Dansal.find({
      type: type,
      location: {
        $geoWithin: {
          $centerSphere: [
            [parseFloat(longitude), parseFloat(latitude)],
            parseFloat(distance) / 6378.1, // Convert distance to radians
          ],
        },
      },
    }).select("location type");
    console.log("Search result:", dansals);
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { dansals: dansals.map(formatDansalMarker) },
          "Dansals fetched successfully",
        ),
      );
  } catch (error) {
    console.error(error);
    return next(
      new ApiError(500, "Failed to fetch dansals", "FETCH_DANSALS_ERROR"),
    );
  }
};
