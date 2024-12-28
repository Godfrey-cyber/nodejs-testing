import request from "supertest";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import app from "../app.js"; // Import your Express app
import User from "../models/userModel.js";

// Mock the User model
jest.mock("../models/userModel.js", () => ({
	findOne: jest.fn(),
	prototype: {
	    save: jest.fn(),
	},
}));

// Mock bcrypt
jest.mock("bcryptjs", () => ({
  	hash: jest.fn(),
}));

// Mock jsonwebtoken
jest.mock("jsonwebtoken", () => ({
  	sign: jest.fn(),
}));

describe("POST /api/v1/users/register-user", () => {
	afterEach(() => {
	    jest.clearAllMocks();
	});

  	it("should return 400 if any field is missing", async () => {
	    const res = await request(app).post("/api/v1/users/register-user").send({});
	    expect(res.statusCode).toBe(400);
	    expect(res.body.msg).toBe("❌ Please enter all fields");
  	});

	it("should return 400 if email format is invalid", async () => {
	    const res = await request(app).post("/api/v1/users/register-user").send({
		    username: "testuser",
		    email: "invalid-email",
		    password: "Password123!",
	    });
	    expect(res.statusCode).toBe(400);
	    expect(res.body.msg).toBe("❌ Please enter a valid email address❗");
	});

  	it("should return 400 if password does not meet criteria", async () => {
	    const res = await request(app).post("/api/v1/users/register-user").send({
		    username: "testuser",
		    email: "test@example.com",
		    password: "123",
	    });
	    expect(res.statusCode).toBe(400);
	    expect(res.body.msg).toBe(
	      "🚫 Password must be between 8 to 15 characters containing at least one lowercase letter, one uppercase letter, one numeric digit, and one special character"
	    );
  	});

  	it("should return 400 if user already exists", async () => {
	    User.findOne.mockResolvedValue({ email: "test@example.com" }); // Mock an existing user

	    const res = await request(app).post("/api/v1/users/register-user").send({
	      	username: "testuser",
	      	email: "test@example.com",
	      	password: "Password123!",
	    });

	    expect(res.statusCode).toBe(400);
	    expect(res.body.message).toBe("User already exists");
	    expect(User.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
  	});

  	it("should hash password, create user, and set a cookie", async () => {
    	User.findOne.mockResolvedValue(null); // Mock no existing user
    	User.prototype.save.mockResolvedValue({ userId: "mockId", username: "newuser" }); // Mock save

    	bcrypt.hash.mockResolvedValue("hashedpassword"); // Mock bcrypt hash
    	jwt.sign.mockImplementation((payload, secret, options, callback) => {
      		callback(null, "mocktoken"); // Mock JWT token generation
    	});

    	const res = await request(app).post("/api/v1/users/register-user").send({
      		username: "newuser",
      		email: "newuser@example.com",
      		password: "Password123!",
    	});

	    expect(res.statusCode).toBe(201);
	    expect(res.body.msg).toBe("User Registration successfull🥇");
	    expect(res.body.username).toBe("newuser");

	    // Check if the mocked methods were called
	    expect(User.findOne).toHaveBeenCalledWith({ email: "newuser@example.com" });
	    expect(User.prototype.save).toHaveBeenCalled();
	    expect(bcrypt.hash).toHaveBeenCalledWith("Password123!", 10);
	    expect(jwt.sign).toHaveBeenCalled();

	    // Check the cookie
	    const cookies = res.headers["set-cookie"];
	    expect(cookies).toBeTruthy();
	    const tokenCookie = cookies.find((cookie) => cookie.startsWith("token="));
	    expect(tokenCookie).toBeTruthy();
  	});

	it("should return 500 if token generation fails", async () => {
	    User.findOne.mockResolvedValue(null); // Mock no existing user
	    User.prototype.save.mockResolvedValue({}); // Mock save
	    bcrypt.hash.mockResolvedValue("hashedpassword"); // Mock bcrypt hash

	    jwt.sign.mockImplementation((payload, secret, options, callback) => {
	      	callback(new Error("Token generation failed"), null); // Mock JWT failure
	    });

	    const res = await request(app).post("/api/v1/users/register-user").send({
		    username: "newuser",
		    email: "newuser@example.com",
		    password: "Password123!",
	    });

	    expect(res.statusCode).toBe(500);
	    expect(res.body.msg).toBe("Something went wrong! Please try again later");
	});
});
