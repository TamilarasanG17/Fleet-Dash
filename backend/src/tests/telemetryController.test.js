const {
  getAllTelemetry,
  getTelemetryByVehicleId,
} = require("../controllers/telemetryController");

const telemetryService = require("../services/telemetryService");

// Mock telemetry service
jest.mock("../services/telemetryService");

describe("Telemetry Controller Unit Tests", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should return all telemetry records", async () => {
    telemetryService.getAllTelemetry.mockResolvedValue([
      {
        vehicleId: "TRUCK001",
        telemetry: [
          {
            latitude: 23.25,
            longitude: 77.41,
            speed: 60,
          },
        ],
      },
    ]);

    const req = {};

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getAllTelemetry(req, res);

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        count: 1,
        data: expect.any(Array),
      })
    );
  });

  test("should return telemetry for a valid vehicle ID", async () => {
    telemetryService.getTelemetryByVehicleId.mockResolvedValue([
      {
        vehicleId: "TRUCK001",
        telemetry: [
          {
            latitude: 23.25,
            longitude: 77.41,
            speed: 60,
          },
        ],
      },
    ]);

    const req = {
      params: {
        vehicleId: "TRUCK001",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getTelemetryByVehicleId(req, res);

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        count: 1,
        data: expect.any(Array),
      })
    );
  });

  test("should return 404 when telemetry data is not found", async () => {
    telemetryService.getTelemetryByVehicleId.mockResolvedValue([]);

    const req = {
      params: {
        vehicleId: "INVALID_TRUCK",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getTelemetryByVehicleId(req, res);

    expect(res.status).toHaveBeenCalledWith(404);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Telemetry data not found for the specified vehicle.",
    });
  });

  test("should return 500 when service throws an error", async () => {
    telemetryService.getTelemetryByVehicleId.mockRejectedValue(
      new Error("Database Error")
    );

    const req = {
      params: {
        vehicleId: "TRUCK001",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getTelemetryByVehicleId(req, res);

    expect(res.status).toHaveBeenCalledWith(500);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: "Failed to fetch telemetry data.",
        error: "Database Error",
      })
    );
  });

});