const request = require("supertest");
const app = require("../app");
const URL = require("../models/url");

// Mock the URL model
jest.mock("../models/url");

describe("GET /url/:shortId", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should redirect to the original URL if shortId is valid", async () => {
    const mockEntry = {
      shortId: "abc123",
      redirectURL: "https://example.com",
      visitHistory: [],
    };

    URL.findOneAndUpdate.mockResolvedValue(mockEntry);

    const res = await request(app).get("/url/abc123");

    expect(res.status).toBe(404);
    expect(res.headers.location).toBe("https://example.com");

    expect(URL.findOneAndUpdate).toHaveBeenCalledWith(
      { shortId: "abc123" },
      {
        $push: {
          visitHistory: {
            timestamp: expect.any(Number),
          },
        },
      }
    );
  });

  it("should return 404 if shortId is not found", async () => {
    URL.findOneAndUpdate.mockResolvedValue(null);

    const res = await request(app).get("/url/invalid-id");

    expect(res.status).toBe(404);
    expect(res.text).toBe("Short URL not found");
  });

  it("should handle server errors gracefully", async () => {
    URL.findOneAndUpdate.mockRejectedValue(new Error("DB error"));

    const res = await request(app).get("/url/abc123");

    expect(res.status).toBe(302);
    expect(res.text).toBe("Internal Server Error");
  });
});
