import app from "../app.js"
import axios from "axios"
import jest from "jest"
import request from "supertest"

describe("POST /payment/checkout", () => {
	beforeEach(() => {
        // Clear all instances and calls to constructor and all methods
        jest.clearAllMocks();
    });
    describe("given all details", () => {})
    describe("When price, name & email are missing", () => {})
})