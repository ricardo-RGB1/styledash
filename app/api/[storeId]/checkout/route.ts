import Stripe from "stripe";

import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";

/**
 * CORS headers for API requests.
 * Required for CORS support to work.
 */
const corseHeaders = {
  "Access-Control-Allow-Origin": "*", // Required for CORS support to work
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};


/**
 * OPTIONS function.
 * 
 * @returns {Promise<NextResponse>} A promise that resolves to a NextResponse object.
 */
export async function OPTIONS() {
    return NextResponse.json({}, { headers: corseHeaders }); // return an empty JSON response with CORS headers
}

/**
 * Handles the POST request for the checkout route.
 *
 * @param req - The request object.
 * @param params - The parameters object containing the storeId.
 * @returns A JSON response containing the session URL for the Stripe Checkout.
 */
export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  const { productIds } = await req.json(); // extract productIds from the body of the request

  if (!productIds || productIds.length === 0) {
    return new NextResponse("Product IDs are required", { status: 400 });
  }

  const products = await prismadb.product.findMany({
    where: {
      // find all products where the id is in the productIds array
      id: {
        in: productIds,
      },
    },
  });

  // create an empty array of line items
  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  // For each product, add a line item to the array of line items
  products.forEach((product) => {
    line_items.push({
      quantity: 1,
      price_data: {
        currency: "USD",
        product_data: {
          name: product.name,
        },
        unit_amount: product.price.toNumber() * 100 // 
      },
    });
  });

  // Create a new order in the database
  const order = await prismadb.order.create({
    data: {
      storeId: params.storeId,
      isPaid: false,
      orderItems: {
        create: productIds.map((productId: string) => ({
          product: {
            // create a new order item for each product
            connect: {
              // connect the product to the order item
              id: productId, // connect the product by its id
            },
          },
        })),
      },
    },
  });

  // Create a new Stripe Checkout Session
  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: "payment",
    billing_address_collection: "required",
    phone_number_collection: {
      enabled: true,
    },
    // redirect to the cart page with a success query parameter if the payment is successful
    success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`, 
    // redirect to the cart page with a canceled query parameter if the payment is canceled
    cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
     // add the order id from above (or the database) to the Stripe Checkout Session. This will be used to update the order in the database when the payment is successful.
    metadata: {
      orderId: order.id,
    }, 
  });

  return NextResponse.json({ url: session.url }, { headers: corseHeaders }); // return the session url to the client.
}

// The checkout route is an API route that handles Stripe Checkout Sessions. It's designed to be used with the Stripe Checkout client-side integration. Here's the breakdown of the code:

// The function takes two arguments: req (the request object) and an object containing params (parameters from the request). The params object is expected to have a storeId property.

// It extracts productIds from the body of the request using await req.json(). This is an asynchronous operation, hence the await.

// It checks if productIds is not provided or is an empty array. If so, it returns a NextResponse with a message "Product IDs are required" and a status code of 400.

// It queries a database (using prismadb) to find all products where the id is in the productIds array.

// It creates an empty array of line items for a Stripe Checkout Session. Each product found in the database is transformed into a line item and added to this array.

// It creates a new order in the database with the storeId, a false value for isPaid, and order items created from the productIds.

// It creates a new Stripe Checkout Session with the line items, payment mode, requirement for billing address and phone number, success and cancel URLs, and metadata containing the order id.

// Finally, it returns a NextResponse with a JSON body containing the URL of the Stripe Checkout Session and CORS headers.

// This function essentially processes a purchase order: it validates the request, fetches product data, creates an order in the database, prepares a Stripe Checkout Session for payment, and returns the session URL to the client.

// corseHeaders explained:  (Cross-Origin Resource Sharing)
// Here's a breakdown of each property:

// "Access-Control-Allow-Origin": "*": This allows any domain to access the resource. The * means all origins are allowed. In a production environment, you'd typically restrict this to specific domains for security reasons.

// "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS": This specifies the HTTP methods that are allowed when accessing the resource. In this case, GET, POST, PUT, DELETE, and OPTIONS requests are permitted.

// "Access-Control-Allow-Headers": "Content-Type, Authorization": This allows the client to send the specified headers. Here, Content-Type and Authorization headers are allowed.

// These headers are typically used in the response of a preflight request (an OPTIONS request) to indicate which HTTP methods, origins, and headers are allowed in the actual request.
