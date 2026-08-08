const request = require("supertest");
const app = require("../app");

describe("Vehicle API Tests", () => {
  test("GET /api/vehicles should return all vehicles", async () => {
    const response = await request(app).get("/api/vehicles");

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.count).toBe(response.body.data.length);
    
  });
  test("GET /api/vehicles/:vehicleId should return a vehicle for a valid ID", async () => {
  const response = await request(app).get("/api/vehicles/TRUCK001");
  expect(response.statusCode).toBe(200);
  expect(response.body.success).toBe(true);
 expect(response.body.data).toHaveProperty("vehicleId", "TRUCK001");
});
test("GET /api/vehicles/:vehicleId should return 404 for an invalid ID", async () => {
  const response = await request(app).get("/api/vehicles/INVALID_ID");

  expect(response.statusCode).toBe(404);
  expect(response.body.success).toBe(false);
  expect(response.body.message).toBe("Vehicle not found.");
});
});