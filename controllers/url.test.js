const {
  handleGenerateNewShortURL,
  handleGetAnalytics,
} = require("../controllers/url.js");

const URL = require("../models/url");
const shortid = require("shortid");

// Mock the URL model and shortid
jest.mock("../models/url");
jest.mock("shortid");

describe("URL Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("handleGenerateNewShortURL", () => {
    it("should return 400 if url is missing", async () => {
      const req = {
        body: {},
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await handleGenerateNewShortURL(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "url is required" });
    });

    it("should create a new short URL and render view", async () => {
      const mockShortId = "abc123";
      shortid.mockReturnValue(mockShortId);

      const req = {
        body: { url: "https://example.com" },
        user: { _id: "user123" },
      };

      const res = {
        render: jest.fn(),
      };

      await handleGenerateNewShortURL(req, res);

      expect(shortid).toHaveBeenCalled();
      expect(URL.create).toHaveBeenCalledWith({
        shortId: mockShortId,
        redirectURL: "https://example.com",
        visitHistory: [],
        createdBy: "user123",
      });
      expect(res.render).toHaveBeenCalledWith("home", { id: mockShortId });
    });
  });

  describe("handleGetAnalytics", () => {
    it("should return analytics data for a valid shortId", async () => {
      const req = {
        params: { shortId: "xyz456" },
      };

      const mockResult = {
        visitHistory: [{ timestamp: 123 }, { timestamp: 456 }],
      };

      URL.findOne.mockResolvedValue(mockResult);

      const res = {
        json: jest.fn(),
      };

      await handleGetAnalytics(req, res);

      expect(URL.findOne).toHaveBeenCalledWith({ shortId: "xyz456" });
      expect(res.json).toHaveBeenCalledWith({
        totalClicks: 2,
        analytics: mockResult.visitHistory,
      });
    });
  });
});
