import app from "../app.js"
import axios from "axios"
import jest from "jest"
import request from "supertest"

describe("POST /users/create-user", () => {
	// describe("given a username & password", () => {
	// 	test("respond with 201 statusCode", async () => {
	// 		const response = await request(app).post("/users/create-user").send({
	// 			username: "Godfrey",
	// 			password: "123456"
	// 		})
	// 		expect(response.statusCode).toBe(201)
	// 		expect(response.body.message).toBe('User created successfully');
	// 	})
		test("GET USERS --> array of users", async () => {
			const response = await request(app).get("/users/get-users").get(
				expect(response.body).toEqual(
					expect.arrayContaining([
						expect.objectContaining({
							username: expect.any(String),
							password: expect.any(String),
							id: expect.any(Number)
						})
					])
				)
			)
	 		expect(response.statusCode).toBe(200)
	 		expect('Content-Type', /json/)
	 		expect(response.body.message).toBe('User created successfully');
		})
		test("GET USERS --> array of users", () => {})
		test("GET USERS --> array of users", () => {})
		test("GET USERS --> array of users", () => {})
	// 	test("Should specify constent header type", async () => {
	// 		const response = await request(app).post("/users/create-user").send({
	// 			username: "username",
	// 			password: "password"
	// 		})
	// 	// 	expect(response.headers['Content-Type']).toEqual(expect.stringContaining('json'))
	// 		expect('Content-Type', /json/)
	// 	})
	// 	test("response has userId", async () => {
	// 		const response = await request(app).post("/users/create-user").send({
	// 			username: "username",
	// 			password: "password",
	// 			userId: 0
	// 		})
	// 		expect(response.body.userId).toBeDefined()
	// 	})
	// })
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
	// describe("")
})