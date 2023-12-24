import prismadb from "@/lib/prismadb";
import { format } from "date-fns";
import OrderClient from "./components/client";
import { OrderColumn } from "./components/columns";
import { formatter } from "@/lib/utils";


/**
 * Renders the OrdersPage component.
 * 
 * @param params - The parameters object containing the storeId.
 * @returns The rendered OrdersPage component.
 */
const OrdersPage = async ({ params }: { params: { storeId: string } }) => {

  /**
   * Retrieves a list of orders from the database.
   * @returns {Promise<Order[]>} A promise that resolves to an array of orders.
   */
  const orders = await prismadb.order.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      orderItems: {
        include: {
          product: true, 
        }
      }
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedOrders: OrderColumn[] = orders.map((item) => ({
    id: item.id,
    phone: item.phone,
    address: item.address,
    isPaid: item.isPaid,
    // Return a comma-separated list of product names.
    products: item.orderItems.map((orderItem) => orderItem.product.name).join(", "),
    // Calculate the total price of the order. 
    totalPrice: formatter.format(item.orderItems.reduce((acc, curr) => { 
      return acc + Number(curr.product.price)
    }, 0)),
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  })); 

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderClient data={formattedOrders} />
      </div>
    </div>
  );
};

export default OrdersPage;
