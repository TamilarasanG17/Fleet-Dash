const {
  getAllGeofences,
} = require("../controllers/geofenceController");

describe("Geofence Controller Unit Tests", () => {

  test("should return all geofences", async () => {

    const req = {};

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getAllGeofences(req, res);

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        count: expect.any(Number),
        data: expect.any(Array),
      })
    );
  });

});