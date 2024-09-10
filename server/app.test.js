import supertest from "supertest"
import app from "./app.js"
import axios from "axios"

describe("POST /users/create-user", () => {
	describe("given a username & password", () => {
		// should save the user to the database
		// respond with a json/200
		test("respond with 200 statuscode", async () => {
			const response = await axios(app).post("/users/create-user").send({
				usernme: "username",
				password: "password"
			})
			expect(response.statusCode).toBe(200)
		})

	})
	describe("When usernme & password is missing", () => {

	})
})