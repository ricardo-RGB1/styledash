import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";


/**
 * Handles the POST request to create a new category for a store.
 * 
 * @param req - The request object.
 * @param params - The parameters object containing the storeId.
 * @returns A NextResponse object with the created category or an error response.
 */
export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json(); // Parses the request body as JSON

    const { name, billboardId } = body;

    if (!userId) {
      // Checks if the user is authenticated
      return new NextResponse("Unathenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!billboardId) {
      return new NextResponse("Billboard id is required", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    // Check if the store id exists for the current user and store the result in a variable called storeBelongsToUser
    const storeBelongsToUser = await prismadb.store.findFirst({
      where: {
        id: params.storeId, 
        userId,
      },
    });

    // Checks if the store id belongs to the current user
    if (!storeBelongsToUser) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    // Creates the data to be inserted into the category route
    const dataToInsert = {
      name, 
      billboardId,
      storeId: params.storeId,
    };

    // Creates a new category for the store
    const category = await prismadb.category.create({
      data: dataToInsert,
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log("[CATEGORIES_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}




/**
 * Retrieves the categories for a specific store.
 *
 * @param {Request} req - The request object.
 * @param {Object} params - The parameters object.
 * @param {string} params.storeId - The store ID.
 * @returns {Promise<NextResponse>} A promise that resolves to the response containing the categories.
 */
export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
     // Checks if the store id is provided
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    /**
     * Retrieves the categories for a specific store.
     *
     * @returns {Promise<Category[]>} A promise that resolves to an array of categories.
     */
    const categories = await prismadb.category.findMany({ 
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.log("[CATEGORIES_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}