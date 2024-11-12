import app from "../app.js"
import axios from "axios"
import jest from "jest"
import request from "supertest"

describe("POST /products/create-product", () => {
	beforeEach(() => {
        // Clear all instances and calls to constructor and all methods
        jest.clearAllMocks();
    });
    describe("given product details", () => {})
    describe("When img or description are missing", () => {})
})