import prismadb from "@/lib/prismadb";
import ProductForm from "./components/product-form";


const ProductPage = async ({
  params,
}: {
  params: { productId: string, storeId: string };
}) => {
  // Query the product from the database
  const product = await prismadb.product.findUnique({
    where: {
      id: params.productId, 
    },
    include: {
      images: true, // include the images related to the product
    }
  }); 

  // params.productId should be "new" since there is no product yet. I will use this fact to trigger the creation of a new product, rather than upadting an existing one. If the productId is matched, then I will trigger an option to update the product.



    // *** REMEMBER, the ProductPage component has access to all database tables, b/c ALL the routes are inside [storeId] and [storeId] has access to categories. So, ProductPage has access to categories, sizes, and colors. ***

  /**
   * Retrieves the categories for a specific store.
   * Fetch all categories from the database where the storeId matches params.storeId, and storing them in the categories constant as an array of Category objects. Exmaple: [{id: 1, name: "Shoes", storeId: 1}, {id: 2, name: "Shirts", storeId: 1}]
   * @param {string} params.storeId - The ID of the store.
   * @returns {Promise<Category[]>} - A promise that resolves to an array of categories.
   */
  const categories = await prismadb.category.findMany({
    where: {
      storeId: params.storeId, // only get the categories for the storeId
    },  
  })

  /**
   * Retrieves the sizes for a specific store.
   * Fetch all sizes from the database where the storeId matches params.storeId, and storing them in the sizes constant as an array of Size objects. Exmaple: [{id: 1, name: "Small", storeId: 1}, {id: 2, name: "Medium", storeId: 1}]
   * @param {string} params.storeId - The ID of the store.
   * @returns {Promise<Size[]>} - A promise that resolves to an array of sizes.     
   */
  const sizes = await prismadb.size.findMany({
    where: {
      storeId: params.storeId, // only get the sizes for the storeId
    },
  });

  /**
   * Retrieves the colors for a specific store.
   * Fetch all colors from the database where the storeId matches params.storeId, and storing them in the colors constant as an array of Color objects. Exmaple: [{id: 1, name: "Red", storeId: 1}, {id: 2, name: "Blue", storeId: 1}]
   * @param {string} params.storeId - The ID of the store.
   * @returns {Promise<Color[]>}
   */    
  const colors = await prismadb.color.findMany({
    where: {
      storeId: params.storeId, // only get the colors for the storeId
    },
  });



  return (
    <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
            <ProductForm 
            categories={categories}
            sizes={sizes}
            colors={colors}
            initialProduct={product} />
        </div>
    </div>
  )
};

export default ProductPage;

