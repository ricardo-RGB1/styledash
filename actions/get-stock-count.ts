import prismadb from "@/lib/prismadb";


/**
 * Retrieves the count of products in stock.
 */
export const getTotalProductsInStock = async (storeId: string) => {
  const productsInStock = await prismadb.product.count({ // count the number of products
    where: {
      storeId,
      isArchived: false, // only count products that are not archived
    },
  });

  return productsInStock;
};

export default getTotalProductsInStock;
