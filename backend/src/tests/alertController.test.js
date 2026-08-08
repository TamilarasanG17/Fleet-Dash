const {
  fetchAllAlerts,
  fetchAlertsByVehicle,
} = require("../controllers/alertController");

const alertService = require("../services/alertService");

// Mock Alert Service
jest.mock("../services/alertService");

describe("Alert Controller Unit Tests", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should return all alerts", async () => {
    alertService.getAllAlerts.mockResolvedValue([
      {
        vehicleId: "TRUCK001",
        eventType: "ENTER",
        geofenceId: "GF001",
      },
    ]);

    const req = {};

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await fetchAllAlerts(req, res);

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        count: 1,
        data: expect.any(Array),
      })
    );
  });

  test("should return alerts for a valid vehicle", async () => {
    alertService.getAlertsByVehicle.mockResolvedValue([
      {
        vehicleId: "TRUCK001",
        eventType: "EXIT",
        geofenceId: "GF001",
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

    await fetchAlertsByVehicle(req, res);

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        count: 1,
        data: expect.any(Array),
      })
    );
  });

  test("should return empty array when vehicle has no alerts", async () => {
    alertService.getAlertsByVehicle.mockResolvedValue([]);

    const req = {
      params: {
        vehicleId: "INVALID_TRUCK",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await fetchAlertsByVehicle(req, res);

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        count: 0,
        data: [],
      })
    );
  });

  test("should return 500 when getAllAlerts throws an error", async () => {
    alertService.getAllAlerts.mockRejectedValue(
      new Error("Database Error")
    );

    const req = {};

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await fetchAllAlerts(req, res);

    expect(res.status).toHaveBeenCalledWith(500);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Database Error",
    });
  });

  test("should return 500 when getAlertsByVehicle throws an error", async () => {
    alertService.getAlertsByVehicle.mockRejectedValue(
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

    await fetchAlertsByVehicle(req, res);

    expect(res.status).toHaveBeenCalledWith(500);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Database Error",
    });
  });

});