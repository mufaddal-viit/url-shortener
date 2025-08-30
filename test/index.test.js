const request = require("supertest");
const express = require("express");
const app = require("../index"); // modify if needed
const URL = require("../models/url");

// Mock the MongoDB model
jest.mock("../models/url");

describe("GET /url/:shortId", () => {
  it("should redirect to the original URL", async () => {
    const fakeURL = {
      shortId: "abc123",
      redirectURL: "https://example.com",
      visitHistory: [],
    };

    URL.findOneAndUpdate.mockResolvedValue(fakeURL);

    const res = await request(app).get("/url/abc123");

    expect(res.status).toBe(302);
    expect(res.header.location).toBe("https://example.com");
    expect(URL.findOneAndUpdate).toHaveBeenCalledWith(
      { shortId: "abc123" },
      { $push: { visitHistory: { timestamp: expect.any(Number) } } }
    );
  });

  it("should return 404 if shortId not found", async () => {
    URL.findOneAndUpdate.mockResolvedValue(null);

    const res = await request(app).get("/url/invalid123");

    expect(res.status).toBe(404); // You should update your route to handle this
  });
});
