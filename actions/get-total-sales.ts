import prismadb from '@/lib/prismadb';


/**
 * Retrieves the total number of sales for a given store.
 * @param storeId - The ID of the store.
 * @returns A promise that resolves to the total number of sales.
 */
export const getNumberOfSales = async (storeId: string) => { 
  
    // Get the total number of sales for the store.
    const totalSalesCount = await prismadb.order.count({ 
        where: {
            storeId,
            isPaid: true,
        },
    });

   return totalSalesCount; 

    
}

export default getNumberOfSales;

