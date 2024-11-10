import app from "../app.js"
import axios from "axios"
import jest from "jest"
import request from "supertest"

describe("POST /users/create-user", () => {
	describe("given a username & password", () => {
		test("GET USERS --> array of users", async () => {
			const newUser = {
			    name: 'John Doe',
			    email: 'john@example.com',
			    password: 'password123',
			    // _id: 0
			};
			const response = await request(app).post("/users/create-user").send(newUser)

	 		expect(response.statusCode).toBe(201)
	 		expect(response.body.message).toBe('User created successfully');
	 		// expect(response.body.user).toHaveProperty('_id');
    		expect(response.body.user.email).toBe(newUser.email);
		})
	})
	describe("When username & password is missing", () => {
		test("Should respond with a status code of 404", async () => {
			const bodyData = [
				{ username: ""},
				{ password: ""},
				{}
			]
			for (const body of bodyData) {
				const response = await request(app).post("/users/create-user").send({body})
				expect(response.statusCode).toBe(404)
			}
		})
	})
	// describe("Should create a user", () => {})
})