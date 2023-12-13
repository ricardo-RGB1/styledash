import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";


/**
 * Handles the POST request for creating a new color for a store.
 * 
 * @param req - The request object.
 * @param params - The parameters object containing the storeId.
 * @returns A NextResponse object with the created color data in JSON format.
 */
export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json(); // Parses the request body as JSON

    const { name, value } = body; // Destructures the request body 

    if (!userId) {
      // Checks if the user is authenticated
      return new NextResponse("Unathenticated", { status: 401 });
    }

    if (!name) {
      // Checks if the name is provided
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!value) {
      // Checks if the value is provided
      return new NextResponse("Value is required", { status: 400 });
    }

    if (!params.storeId) {
      // Checks if the store id is provided
      return new NextResponse("Store id is required", { status: 400 });
    }

    // Check if the store id exists for the current user and store the result in a variable called storeBelongsToUser
    const storeBelongsToUser = await prismadb.store.findFirst({
      where: {
        id: params.storeId, 
        userId,
      },
    });

    if (!storeBelongsToUser) {
      // Checks if the store id belongs to the current user
      return new NextResponse("Unauthorized", { status: 403 });
    }

    // Creates the data to be inserted into the size route
    const dataToInsert = {
      name, // name: name
      value,
      storeId: params.storeId,
    };


    // Creates a new billboard for the store
    const color = await prismadb.color.create({
      data: dataToInsert,
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log("[COLORS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}




/**
 * Retrieves the colors for a specific store.
 * 
 * @param req - The request object.
 * @param params - The parameters object containing the storeId.
 * @returns A JSON response containing the colors for the specific store.
 * @throws If the storeId is not provided or if there is an internal error.
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

 
    // Retrieves the color (many) for the specific store 
    const colors = await prismadb.color.findMany({ 
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(colors);
  } catch (error) {
    console.log("[COLORS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 