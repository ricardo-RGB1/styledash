import prismadb from '@/lib/prismadb';

/**
 * Retrieves the total revenue for a given store.
 * @param storeId - The ID of the store.
 * @returns The total revenue of the store.
 */
export const getTotalRevenue = async (storeId: string) => { 
    
    /**
     * Retrieves the paid orders from the database.
     * 
     * @returns {Promise<Order[]>} A promise that resolves to an array of paid orders.
     */
    const paidOrders = await prismadb.order.findMany({
        where: {
            storeId,
            isPaid: true,
        },
        include: { 
            orderItems: { 
                include: {
                    product: true
                }
            }
        }
    });
 
    /**
     * Calculates the total revenue of the store.
     * 
     * @returns {number} The total revenue of the store.
     */
    const totalRevenue = paidOrders.reduce((total, order) => { 
        const orderTotal = order.orderItems.reduce((orderSum, item) => { 
            return orderSum + item.product.price.toNumber();
        }, 0);

        return total + orderTotal;
    }, 0);

    return totalRevenue; 
    
}

export default getTotalRevenue;


// The getTotalRevenue function takes a storeId as an argument. It uses this storeId to retrieve all paid orders from the database. It then calculates the total revenue of the store by adding the total price of all items in each order.

// paidOrders.reduce((total, order) => {...}, 0);: This is a reduce function that is used to calculate a single output (in this case, the total revenue) from an array of elements (in this case, the paidOrders array). The reduce function takes a callback function as its first argument and an initial value as its second argument. The callback function is called for each element in the array. In this case, the callback function takes two arguments: total and order. total is the accumulated value returned in the last invocation of the callback—or the initial value, if this is the first invocation. order is the current element being processed in the array.

// Inside the reduce function, there's another reduce function: order.orderItems.reduce((orderSum, item) => {...}, 0);. This one calculates the total price of all items in a single order. It works similarly to the outer reduce function, but it operates on the orderItems array of the current order. orderSum is the accumulated value returned in the last invocation of the callback—or the initial value, if this is the first invocation. item is the current element being processed in the array.

// return orderSum + item.product.price.toNumber();: This line calculates the total price of the current order by adding the price of the current item to the running total (orderSum). The toNumber() function is called to ensure that the price is a number.

// return total + orderTotal;: This line adds the total price of the current order to the running total of all orders (total), and returns this new total. This returned value will be used as the total argument in the next invocation of the callback.

// The final result of the outer reduce function is stored in the totalRevenue constant. This is the total revenue from all paid orders.