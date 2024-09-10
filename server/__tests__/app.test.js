import app from "../app.js"
import axios from "axios"
import jest from "jest"
import request from "supertest"

describe("POST /users/create-user", () => {
	describe("given a username & password", () => {
		// should save the user to the database
		// respond with a json/200
		test("respond with 200 statusCode", async () => {
			const response = await request(app).post("/users/create-user").send({
				username: "Godfrey",
				password: "123456"
			})
			expect(response.statusCode).toBe(201)
		})
		// test("Should specify constent header type", async () => {
		// 	const response = await request(app).post("/users/create-user").send({
		// 		username: "username",
		// 		password: "password"
		// 	})
		// 	expect(response.headers['content-type']).toEqual(expect.stringContaining('json'))
		// })
		test("response has userId", async () => {
			const response = await request(app).post("/users/create-user").send({
				username: "username",
				password: "password",
				userId: 0
			})
			expect(response.body.userId).toBeDefined()
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
})