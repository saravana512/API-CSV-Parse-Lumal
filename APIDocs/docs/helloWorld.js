/**
 * @openapi
 * {
 *   "openapi": "3.0.0",
 *   "info": {
 *     "title": "Hello World API",
 *     "description": "API for returning a Hello World message",
 *     "version": "1.0.0"
 *   },
 *   "paths": {
 *     "/helloworld": {
 *       "get": {
 *         "summary": "Returns a Hello World message",
 *         "description": "This endpoint returns a Hello World message along with some additional data.",
 *         "operationId": "getHelloWorld",
 *         "tags": ["Hello World"],
 *         "responses": {
 *           "200": {
 *             "description": "Successful response",
 *             "content": {
 *               "application/json": {
 *                 "schema": {
 *                   "type": "object",
 *                   "properties": {
 *                     "Message": {
 *                       "type": "string",
 *                       "example": "Hello World"
 *                     },
 *                     "data": {
 *                       "type": "object"
 *                     }
 *                   }
 *                 }
 *               }
 *             }
 *           },
 *           "500": {
 *             "description": "Internal Server Error",
 *             "content": {
 *               "application/json": {
 *                 "schema": {
 *                   "type": "object",
 *                   "properties": {
 *                     "success": {
 *                       "type": "string",
 *                       "example": "false"
 *                     },
 *                     "message": {
 *                       "type": "string",
 *                       "example": "Internal server error"
 *                     },
 *                     "error": {
 *                       "type": "object",
 *                       "properties": {
 *                         "statusCode": {
 *                           "type": "integer",
 *                           "example": 500
 *                         },
 *                         "message": {
 *                           "type": "string",
 *                           "example": "Error message details"
 *                         },
 *                         "stack": {
 *                           "type": "string",
 *                           "example": "Error stack trace"
 *                         }
 *                       }
 *                     }
 *                   }
 *                 }
 *               }
 *             }
 *           }
 *         }
 *       }
 *     }
 *   }
 * }
 */
