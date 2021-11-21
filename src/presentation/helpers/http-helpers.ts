import { HttpResponse } from "../protocols/http-response"

export const badRequest = (error: Error): HttpResponse => ({
    statusCode: 400,
    body: error
})