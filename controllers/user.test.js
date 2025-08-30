const { handleUserSignup, handleUserLogin } = require("../controllers/user");
const User = require("../models/user");
const { setUser } = require("../service/auth");
const { v4: uuidv4 } = require("uuid");

jest.mock("../models/user");
jest.mock("../service/auth");
jest.mock("uuid");

describe("User Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("handleUserSignup", () => {
    it("should create a new user and redirect to /", async () => {
      const req = {
        body: {
          name: "John Doe",
          email: "john@example.com",
          password: "password123",
        },
      };

      const res = {
        redirect: jest.fn(),
      };

      User.create.mockResolvedValue({});

      await handleUserSignup(req, res);

      expect(User.create).toHaveBeenCalledWith({
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      });

      expect(res.redirect).toHaveBeenCalledWith("/");
    });
  });

  describe("handleUserLogin", () => {
    it("should render login with error if user not found", async () => {
      const req = {
        body: {
          email: "john@example.com",
          password: "wrongpassword",
        },
      };

      const res = {
        render: jest.fn(),
      };

      User.findOne.mockResolvedValue(null);

      await handleUserLogin(req, res);

      expect(User.findOne).toHaveBeenCalledWith({
        email: "john@example.com",
        password: "wrongpassword",
      });

      expect(res.render).toHaveBeenCalledWith("login", {
        error: "Invalid Username or Password",
      });
    });

    it("should set session, cookie and redirect if user found", async () => {
      const req = {
        body: {
          email: "john@example.com",
          password: "correctpassword",
        },
      };

      const res = {
        cookie: jest.fn(),
        redirect: jest.fn(),
      };

      const fakeUser = { id: "user123", email: "john@example.com" };
      const fakeSessionId = "session-uuid";

      User.findOne.mockResolvedValue(fakeUser);
      uuidv4.mockReturnValue(fakeSessionId);
      setUser.mockImplementation(() => {});

      await handleUserLogin(req, res);

      expect(User.findOne).toHaveBeenCalledWith({
        email: "john@example.com",
        password: "correctpassword",
      });

      expect(uuidv4).toHaveBeenCalled();
      expect(setUser).toHaveBeenCalledWith(fakeSessionId, fakeUser);
      expect(res.cookie).toHaveBeenCalledWith("uid", fakeSessionId);
      expect(res.redirect).toHaveBeenCalledWith("/");
    });
  });
});
