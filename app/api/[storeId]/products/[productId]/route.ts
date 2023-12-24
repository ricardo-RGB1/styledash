import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

/**
 * Retrieves a product with the specified product ID, including images, category, color, and size.
 * @param req - The request object.
 * @param params - The parameters object containing the product ID.
 * @returns A JSON response containing the product information.
 * @throws If the product ID is missing or if there is an internal error.
 */
export async function GET(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    if (!params.productId) {
      return new NextResponse("Product id is required", { status: 400 });
    }

    // Retrieve the product with the specified product ID & include the images, category, color, and size
    const product = await prismadb.product.findUnique({
      where: {
        id: params.productId,
      },
      include: {
        images: true,
        category: true,
        color: true,
        size: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCT_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}





/**
 * Updates a product in the database.
 *
 * @param req - The incoming HTTP request object.
 * @param params - The parameters for updating the product.
 * @returns The updated product.
 */
export async function PATCH(
  req: Request, // the incoming HTTP request object
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json(); // get the request body

    const {
      name,
      price,
      categoryId,
      colorId,
      sizeId,
      images,
      isFeatured,
      isArchived,
    } = body;

    // Loop through the body object and check if the values are empty
    for (let [key, value] of Object.entries(body)) {
      if (key !== "isArchived" && key !== "isFeatured" && !value) {
        return new NextResponse(
          `${key.charAt(0).toUpperCase() + key.slice(1)} is required`,
          { status: 400 }
        );
      }
    }

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.productId) {
      return new NextResponse("Product id is required", { status: 400 });
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

    await prismadb.product.update({
      where: {
        id: params.productId,
      },
      data: {
        name,
        price,
        categoryId,
        colorId,
        sizeId,
        isArchived,
        isFeatured,
        images: {
          deleteMany: {}, // delete all images
        }
      },
    });

  
    /**
     * Updates a product in the database.
     *
     * @param params - The parameters for updating the product.
     * @param images - The images to be associated with the product.
     * @returns The updated product.
     */
    const product = await prismadb.product.update({ 
      where: {
        id: params.productId
      },
      data: {
        images: {
          createMany: {
            data: [
              ...images.map((image: { url: string}) => image)
            ]
          }
        }
      }
    })

    return NextResponse.json(product); // return the updated product
  } catch (error) {
    console.log("[PRODUCT_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}





/**
 * Deletes a product from the database.
 *
 * @param req - The incoming HTTP request object.
 * @param params - The parameters for deleting the product.
 * @returns The deleted product.
 */
export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.productId) {
      return new NextResponse("Product id is required", { status: 400 });
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
     * Deletes a product from the database.
     *
     * @param product - The product to be deleted.
     * @returns A promise that resolves to the deleted product.
     */
    const product = await prismadb.product.deleteMany({
      where: {
        id: params.productId, // delete the product with the specified productId
      },
    });

    return NextResponse.json(product); // return the deleted store
  } catch (error) {
    console.log("[PRODUCT_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
