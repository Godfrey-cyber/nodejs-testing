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

beforeEach(() => {
    jest.clearAllMocks();
});

// User.findOne = jest.fn();

// Mock bcrypt
jest.mock("bcryptjs", () => ({
  	hash: jest.fn(),
}));

jest.mock("bcryptjs", () => ({
  compare: jest.fn(),
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
  		const mockUserId = "mockUserId";
	    const mockUsername = "mockUser";
	    const mockEmail = "newuser@example.com";
	    const mockPassword = "Password123!";
	    const mockHashedPassword = "hashedpassword";
	    const mockToken = "mocktoken";

	    User.findOne.mockResolvedValue(null); // Mocking no user
    	User.prototype.save.mockResolvedValue({
		    userId: mockUserId,
	        username: mockUsername,
	        email: mockEmail,
	    });
    	
    	bcrypt.hash.mockResolvedValue(mockHashedPassword);
    	jwt.sign.mockImplementation((payload, secret, options, callback) => {
	        callback(null, mockToken);
	    });

    	const res = await request(app).post("/api/v1/users/register-user").send({
	        username: mockUsername,
	        email: mockEmail,
	        password: mockPassword,
	    });
    	// Response validation
	    expect(res.statusCode).toBe(201);
	    expect(res.body.msg).toBe("User Registration successfull🥇");
	    expect(res.body.username).toBe(mockUsername);
	    const user = await User.findOne({ email: mockEmail });
    	expect(user).toBeTruthy();

	    // Mock calls validation
	    expect(User.findOne).toHaveBeenCalledWith({ email: mockEmail });
	    expect(User.prototype.save).toHaveBeenCalled();
	    expect(bcrypt.hash).toHaveBeenCalledWith(mockPassword, 10);
	    expect(jwt.sign).toHaveBeenCalled();

	    // Cookie validation
	    const cookies = res.headers["set-cookie"];
	    expect(cookies).toBeTruthy();
	    const tokenCookie = cookies.find((cookie) => cookie.startsWith("token="));
	    expect(tokenCookie).toBeTruthy();
	    expect(tokenCookie).toContain("HttpOnly");
	    expect(tokenCookie).toContain("Secure");
  	});

	it("should return 500 if token generation fails uring registration", async () => {
		const mockEmail = "test@example.com";
	    const mockPassword = "Password123!";
	    const mockHashedPassword = "hashedpassword";
	    User.findOne.mockResolvedValue(null); // Mock no existing user
	    User.prototype.save.mockResolvedValue({
        	_id: "mockUserId",
	        username: "mockUser",
	        email: mockEmail,
	    });
	    bcrypt.hash.mockResolvedValue(mockHashedPassword);

	    jwt.sign.mockImplementation((payload, secret, options, callback) => {
	        callback(new Error("Token generation failed"), null); // Mock JWT failure
	    });
	    const res = await request(app).post("/api/v1/users/register-user").send({
	        email: mockEmail,
	        password: mockPassword,
	    });

		expect(res.statusCode).toBe(500);
	    expect(res.body.msg).toBe("Something went wrong! Please try again later");
	    expect(User.findOne).toHaveBeenCalledWith({ email: mockEmail });
	    expect(User.prototype.save).toHaveBeenCalled();
	    expect(bcrypt.hash).toHaveBeenCalledWith(mockPassword, 10);
	    expect(jwt.sign).toHaveBeenCalled();
	});
});
// login user
describe("POST /api/v1/users/login-user", () => {
	afterEach(() => {
	    jest.clearAllMocks();
	});

  	it("should return 400 if any field is missing", async () => {
	    const res = await request(app).post("/api/v1/users/login-user").send({});
	    expect(res.statusCode).toBe(400);
	    expect(res.body.msg).toBe("❌ Please fill in all fields");
  	});

	it("should return 400 if email format is invalid", async () => {
	    const res = await request(app).post("/api/v1/users/login-user").send({
		    email: "invalid-email",
		    password: "Password123!",
	    });
	    expect(res.statusCode).toBe(400);
	    expect(res.body.msg).toBe("❌ Please enter a valid email address❗");
	});

  	it("should return 400 if password does not meet criteria", async () => {
	    const res = await request(app).post("/api/v1/users/login-user").send({
		    email: "test@example.com",
		    password: "12345",
	    });
	    expect(res.statusCode).toBe(400);
	    expect(res.body.msg).toBe(
	      "🚫 Password must be between 8 to 15 characters containing at least one lowercase letter, one uppercase letter, one numeric digit, and one special character"
	    );
  	});

  	it("should return 400 if email does not exist", async () => {
	    User.findOne.mockResolvedValue(null); // Mock an existing user

	    const res = await request(app).post("/api/v1/users/login-user").send({
	      	email: "nonexistent@example.com",
	      	password: "Password123!",
	    });

	    expect(res.statusCode).toBe(400);
	    expect(res.body.msg).toBe("🚫 This email does not exist!");
	    expect(User.findOne).toHaveBeenCalledWith({ email: "nonexistent@example.com" });
  	});

  	it("should return 400 if password is incorrect", async () => {
  		const mockEmail = "test@example.com";
	    const mockPassword = "WrongPassword123!";
	    const mockHashedPassword = "hashedpassword";

	    User.findOne.mockResolvedValue({ password: mockHashedPassword }); // Mock user exists
	    bcrypt.compare.mockResolvedValue(false); // Mock incorrect password

	    const res = await request(app).post("/api/v1/users/login-user").send({
	        email: mockEmail,
	        password: mockPassword,
	    });

	    console.log(res.statusCode, res.body);
	    // console.log(res);

	    expect(res.statusCode).toBe(400);
	    expect(res.body.msg).toBe("🚫 Invalid email or password.");
	    // Validate mock calls
	    expect(User.findOne).toHaveBeenCalledWith({ email: mockEmail });
	    expect(bcrypt.compare).toHaveBeenCalledWith(mockPassword, mockHashedPassword);
	    const cookies = res.headers["set-cookie"];
		expect(cookies).toBeFalsy();
		expect(User.prototype.save).not.toHaveBeenCalled();
  	});

  	it("should return 200 and set a cookie if login is successful", async () => {
	    User.findOne.mockResolvedValue({
		    _id: "mockUserId",
		    username: "mockUser",
		    password: "hashedpassword",
	    }); // Mock user exists
	    bcrypt.compare.mockResolvedValue(true); // Mock correct password
	    jwt.sign.mockImplementation((payload, secret, options, callback) => {
	      	callback(null, "mockToken"); // Mock JWT token generation
	    });

	    const res = await request(app).post("/api/v1/users/login-user").send({
		    email: "test@example.com",
		    password: "Password123!",
	    });
	    console.log('object')

	    expect(res.statusCode).toBe(200);
	    expect(res.body.username).toBe("mockUser");
	    expect(res.body.token).toBe("mockToken");
	    expect(User.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
	    expect(bcrypt.compare).toHaveBeenCalledWith("Password123!", "hashedpassword");
	    expect(jwt.sign).toHaveBeenCalled();

	    // Check the cookie
	    const cookies = res.headers["set-cookie"];
	    expect(cookies).toBeTruthy();
	    const tokenCookie = cookies.find((cookie) => cookie.startsWith("token="));
	    expect(tokenCookie).toBeTruthy();
    });

	it("should return 500 if token generation fails", async () => {
	    User.findOne.mockResolvedValue(); // Mock no existing user
	    bcrypt.compare.mockResolvedValue(true); // Mock correct password

	    jwt.sign.mockImplementation((payload, secret, options, callback) => {
	      	callback(new Error("Token generation failed"), null); // Mock JWT failure
	    });
	    const res = await request(app).post("/api/v1/users/login-user").send({
		    email: "test@example.com",
		    password: "Password123!",
		});

		expect(res.statusCode).toBe(400);
	    expect(res.body.msg).toBe("🚫 Something wrong happened we cannot verify you.");
	    expect(jwt.sign).toHaveBeenCalled();
	});
});

describe("GET users /api/v1/users/get-users", () => {
	let req, res;

  	beforeEach(() => {
	    User.find.mockReset();

	    req = {
	      	query: {},
	    };
	    res = {
		    status: jest.fn().mockReturnThis(),
		    json: jest.fn().mockReturnThis(),
	    };
	});

  	it('should return all users without password when no "new" query param is provided', async () => {
	    const mockUsers = [{ username: 'john' }, { username: 'jane' }];
	    User.find.mockResolvedValue(mockUsers);

	    req.query = {};

	    await getUsers(req, res);

	    expect(User.find).toHaveBeenCalledWith();
	    expect(res.status).toHaveBeenCalledWith(200);
	    expect(res.json).toHaveBeenCalledWith({
		    users: mockUsers,
		    status: 'Success',
		    count: mockUsers.length
	    });
  	});

  	it('should return sorted and limited users when "new" query param is provided', async () => {
	    const mockUsers = [{ username: 'john' }, { username: 'jane' }];
	    User.find.mockResolvedValue(mockUsers);
	    User.find().sort.mockReturnThis();
	    User.find().limit.mockReturnThis();

	    req.query = { new: true };

	    await getUsers(req, res);

	    expect(User.find).toHaveBeenCalled();
	    expect(User.find().sort).toHaveBeenCalledWith({ createdAt: -1 });
	    expect(User.find().limit).toHaveBeenCalledWith(5);
	    expect(res.status).toHaveBeenCalledWith(200);
	    expect(res.json).toHaveBeenCalledWith({
	        users: mockUsers,
	        status: 'Success',
	        count: mockUsers.length
	    });
  	});

  	it('should return error message when there is an exception', async () => {
	    const mockError = new Error('Database error');
	    User.find.mockRejectedValue(mockError); // Simulate error

	    req.query = {};

	    await getUsers(req, res);

	    expect(res.status).toHaveBeenCalledWith(500);
	    expect(res.json).toHaveBeenCalledWith({
	      	status: 'Fail',
	      	msg: mockError.message,
	    });
  	});
})