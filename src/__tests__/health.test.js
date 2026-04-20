/**
 * Health endpoint tests
 * @module __tests__/health.test
 */

const request = require("supertest");
const app = require("../app");

describe("Health Check Endpoints", () => {
  describe("GET /", () => {
    it("should return success message", async () => {
      const response = await request(app)
        .get("/")
        .expect(200);

      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("message");
      expect(response.body).toHaveProperty("data");
    });

    it("should have Cache-Control header", async () => {
      const response = await request(app).get("/");

      expect(response.headers["cache-control"]).toBeDefined();
    });
  });

  describe("GET /health", () => {
    it("should return health status", async () => {
      const response = await request(app)
        .get("/health")
        .expect(200);

      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("message", "Service healthy");
      expect(response.body.data).toHaveProperty("uptime");
      expect(response.body.data).toHaveProperty("environment");
      expect(response.body.data).toHaveProperty("timestamp");
      expect(response.body.data).toHaveProperty("database");
    });

    it("should have no-store cache control", async () => {
      const response = await request(app).get("/health");

      expect(response.headers["cache-control"]).toContain("no-store");
    });
  });

  describe("404 Not Found", () => {
    it("should return 404 for non-existent route", async () => {
      const response = await request(app)
        .get("/non-existent-route")
        .expect(404);

      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("requestId");
    });
  });
});
