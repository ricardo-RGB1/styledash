import prismadb from "@/lib/prismadb";

interface GraphData {
  name: string;
  total: number;
}

/**
 * Retrieves the revenue data for a given store and organizes it into a graph-friendly format.
 * @param {string} storeId - The ID of the store.
 * @returns {GraphData[]} An array of graph data objects, where each object represents a month and the total revenue for that month. Exm: { name: 'Jan', total: 1000 }
 */
export const getRevenueForGraph = async (storeId: string): Promise<GraphData[]> => {
  const paidOrders = await prismadb.order.findMany({
    where: {
      storeId,
      isPaid: true,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  /**
   * Object representing monthly revenue.
   * e.g. { 0: 1000, 1: 2000, 2: 3000, ... }
   * @type {Object.<number, number>}
   */
  const monthlyRevenue: { [key: number]: number } = {};
   

  // Loop through all paid orders and add the revenue for each order to the monthly revenue.
  paidOrders.forEach((order) => {
    const month = order.createdAt.getMonth();
    const revenueForOrder = order.orderItems.reduce(
      (total, item) => total + item.product.price.toNumber(),
      0
    );
    monthlyRevenue[month] = (monthlyRevenue[month] || 0) + revenueForOrder; // If there is no revenue for the month yet, use 0 as the starting point.
  });

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun", 
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ]; // e.g. Jan is 0, Feb is 1, etc.)

  // Create an array of graph data objects, where each object represents a month and the total revenue for that month. 
  // Exm: [
    // { name: 'Jan', total: 1000 }, 
    // { name: 'Feb', total: 2000 }, etc.
    //    ]
const graphData: GraphData[] = months.map((month) => ({ name: month, total: 0 }));

// Loop through each month and add the revenue for that month to the graph data.
Object.entries(monthlyRevenue).forEach(([month, revenue]) => {
    graphData[parseInt(month)].total = revenue; // e.g. graphData[0] is Jan, graphData[1] is Feb, etc.
    
});
    
  return graphData; 
 
};

export default getRevenueForGraph;

// paidOrders.forEach(order => { ...
// This code is calculating the total revenue for each month from a list of orders. Here's a step-by-step explanation:
// It goes through each order in the paidOrders list.
// For each order, it gets the month when the order was created.
// It calculates the total revenue for that order. It does this by going through each item in the order, getting the price of the product for that item, and adding up all these prices. This is done using the reduce function.
// It then adds this total revenue to the revenue already calculated for the month. If no revenue has been calculated for the month yet, it uses 0 as the starting point.
// The result is stored in monthlyRevenue, which is an array where each index represents a month and the value at that index is the total revenue for that month.

// Graph data explained:
// Create an array of graph data objects, where each object represents a month and the total revenue for that month. Exm: { name: 'Jan', total: 1000 }

// Object.entries() returns an array of a given object's own enumerable string-keyed property [key, value] pairs, in the same order as that provided by a for...in loop. (The only important difference is that a for...in loop enumerates properties in the prototype chain as well).



// So, Object.entries(monthlyRevenue) returns an array where each element is an array with two elements: the first element is the month (as a string) and the second element is the revenue for that month.
// This piece of code is iterating over the monthlyRevenue object and updating the total property of the corresponding month in the graphData array. Here's a step-by-step breakdown:

    // Object.entries(monthlyRevenue): This is a built-in JavaScript function that returns an array of a given object's own enumerable string-keyed property [key, value] pairs. For the monthlyRevenue object, each entry will be an array where the first element is the month (as a string) and the second element is the revenue for that month: Example: 
        // [
        // ['0', 1000], ['1', 2000], ['2', 3000], 
        // ...]

    // .forEach(([month, revenue]) => { ... }): This is calling the forEach() method on the array returned by Object.entries(monthlyRevenue). forEach() executes a provided function once for each array element. The provided function is an arrow function that takes two arguments, month and revenue, which correspond to the two elements of each entry in the Object.entries(monthlyRevenue) array.

    // graphData[parseInt(month)].total = revenue;: Inside the forEach() loop, this line is executed for each [month, revenue] pair. It's updating the total property of the corresponding month in the graphData array with the revenue for that month. parseInt(month) is used to convert the month from a string to a number, because the indices of the graphData array are numbers.

    // So, in simple terms, this code is updating the total revenue for each month in the graphData array based on the revenue data in the monthlyRevenue object.