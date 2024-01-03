import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";



/**
 * Retrieves a category by its ID.
 * @param req - The request object.
 * @param params - The parameters object containing the category ID.
 * @returns A JSON response with the category data if found, or an error response if not found or an internal error occurs.
 */
export async function GET(
    req: Request,
    { params }: { params: { categoryId: string } }
  ) {
    try {
      if (!params.categoryId) {
        return new NextResponse("Category id is required", { status: 400 });
      }

    
      /**
       * Retrieves a category and its associated billboard from the database.
       *
       * @param params - The parameters for retrieving the category.
       * @returns The category object with its associated billboard.
       */
      const category = await prismadb.category.findUnique({
        where: {
          id: params.categoryId
        },
        include: {
          billboard: true
        }
      });
    
      return NextResponse.json(category);
    } catch (error) {
      console.log('[CATEGORY_GET]', error);
      return new NextResponse("Internal error", { status: 500 });
    }
  };


/**
 * Updates a billboard with the specified store ID and billboard ID.
 *
 * @param req - The incoming HTTP request object.
 * @param params - An object containing the store ID and billboard ID.
 * @returns A JSON response containing the updated billboard.
 */
export async function PATCH(
  req: Request, // the incoming HTTP request object
  { params }: { params: { storeId: string; categoryId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json(); // get the request body

    const { name, billboardId } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (!billboardId) {
      return new NextResponse("Billboard is required", { status: 400 });
    }

    if (!params.categoryId) {
      return new NextResponse("Category id is required", { status: 400 });
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

    const category = await prismadb.category.updateMany({
      where: {
        id: params.categoryId,
      },
      data: {
        name,
        billboardId,
      },
    });

    return NextResponse.json(category); // return the updated category
  } catch (error) {
    console.log("[CATEGORY_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

/**
 * Deletes a store.
 *
 * @param req - The request object.
 * @param params - The parameters object containing the storeId.
 * @returns A NextResponse object with the deleted store data.
 */
export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; categoryId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.categoryId) {
      return new NextResponse("Category id is required", { status: 400 });
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

    /**
     * Deletes a billboard from the database.
     *
     * @param category - The billboard to be deleted.
     * @returns A promise that resolves to the deleted billboard.
     */
    const category = await prismadb.category.deleteMany({
      where: {
        id: params.categoryId // delete the category with the specified categoryId
      },
    });

    return NextResponse.json(category); // return the deleted store
  } catch (error) {
    console.log("[CATEGORY_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
