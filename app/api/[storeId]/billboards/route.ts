import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

/**
 * Handles the POST request for creating a new billboard for a store.
 * @param req - The request object.
 * @param params - The parameters object containing the storeId. 
 * So, this line of code is saying: "I expect to receive an object. I'm going to extract the params property from that object. The params property should be an object itself, with a storeId property that is a string."
 * @returns A NextResponse object with the created store billboard data in JSON format.
 */
export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json(); // Parses the request body as JSON

    // Destructure the label and imageUrl from the request body
    const { label, imageUrl } = body 

    if (!userId) {
      // Checks if the user is authenticated
      return new NextResponse("Unathenticated", { status: 401 });
    }

    if (!label) {
      // Checks if the label is provided
      return new NextResponse("Label is required", { status: 400 });
    }
    if (!imageUrl) {
      // Checks if the imageUrl is provided
      return new NextResponse("Image is required", { status: 400 });
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

    // Creates the data to be inserted into the billboard route
    const dataToInsert = {
      label, 
      imageUrl,
      storeId: params.storeId,
    };

    // Creates a new billboard for the store
    const billboard = await prismadb.billboard.create({
      data: dataToInsert,
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("[BILLBOARDS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}



/**
 * Retrieves the billboards for a specific store.
 * @param req - The request object.
 * @param params - The parameters object containing the storeId.
 * @returns A JSON response containing the billboards for the store.
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

 
    // Retrieves the billboards (many) for the specific store 
    const billboards = await prismadb.billboard.findMany({ 
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(billboards);
  } catch (error) {
    console.log("[BILLBOARDS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}