import { PrismaClient } from '@prisma/client'

/**
 * Global declaration for the Prisma client instance.
 * 
 * @global
 * @var prisma - The Prisma client instance.
 * @type {PrismaClient | undefined}
 */
declare global {
    var prisma: PrismaClient | undefined
}
/**
 * The Prisma database client.
 * If the global `prisma` object is available, it will be used as the client.
 * Otherwise, a new instance of `PrismaClient` will be created.
 */
const prismadb = globalThis.prisma || new PrismaClient();

// Set the global `prisma` object to the created `PrismaClient` instance in non-production environments.
if (process.env.NODE_ENV !== "production") globalThis.prisma = prismadb;


// Export the Prisma client instance.
export default prismadb;



// The if statement checks the value of the process.env.NODE_ENV environment variable. In JavaScript and Node.js, the process.env object provides access to environment variables defined in the current environment. The NODE_ENV environment variable is commonly used to indicate the current environment, such as "development", "production", or "test".

// In this code, the condition process.env.NODE_ENV !== "production" checks if the current environment is not set to "production". If the condition is true, the code block inside the if statement is executed.

// Inside the code block, the globalThis.prisma variable is assigned the value of the prismadb object. The globalThis object is a global object that provides access to the global scope in both browser and Node.js environments. By assigning prismadb to globalThis.prisma, the prismadb object becomes accessible globally throughout the application.

// This code is commonly used during development or testing to make the prismadb object easily accessible for debugging or other purposes. In a production environment, where performance and security are critical, this code may be excluded or modified to prevent exposing sensitive information or unnecessary global variables.