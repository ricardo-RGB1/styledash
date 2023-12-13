import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

/**
 * Retrieves the size with the specified sizeId.
 * @param req - The request object.
 * @param params - The parameters object containing the sizeId.
 * @returns A NextResponse object with the size data or an error response.
 */
export async function GET(
  req: Request,
  { params }: { params: { colorId: string } }
) {
  try {
    if (!params.colorId) {
      return new NextResponse("Color id is required", { status: 400 });
    }

    const color = await prismadb.color.findUnique({
      where: {
        id: params.colorId,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log("[COLOR_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

/**
 * Updates the color information for a specific store.
 * 
 * @param req - The incoming HTTP request object.
 * @param params - The parameters object containing the storeId and colorId.
 * @returns A JSON response containing the updated color information.
 */
export async function PATCH(
  req: Request, // the incoming HTTP request object
  { params }: { params: { storeId: string; colorId: string } } // the parameters object containing the storeId and colorId
) {
  try {
    const { userId } = auth();
    const body = await req.json(); // get the request body

    const { name, value } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (!value) {
      return new NextResponse("Value is required", { status: 400 });
    }

    if (!params.colorId) {
      return new NextResponse("Size id is required", { status: 400 });
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

    /**
     * Updates the color with the specified ID.
     *
     * @param {string} params.colorId - The ID of the color to update.
     * @param {string} name - The new name of the color.
     * @param {string} value - The new value of the color.
     * @returns {Promise<any>} - A promise that resolves to the updated color.
     */
    const color = await prismadb.color.updateMany({
      where: {
        id: params.colorId,
      },
      data: {
        name,
        value,
      },
    });

    return NextResponse.json(color); // return the updated color
  } catch (error) {
    console.log("[COLOR_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}


/**
 * Deletes a size from a store.
 * 
 * @param req - The request object.
 * @param params - The parameters object containing the storeId and colorId.
 * @returns A JSON response containing the deleted size.
 */
export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; colorId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.colorId) {
      return new NextResponse("Color id is required", { status: 400 });
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

   
    const color = await prismadb.color.deleteMany({
      where: {
        id: params.colorId, // delete the color with the specified sizeId
      },
    });

    return NextResponse.json(color); // return the deleted color
  } catch (error) {
    console.log("[COLOR_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
