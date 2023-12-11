import prismadb from "@/lib/prismadb";
import CategoryForm from "./components/category-form";



const CategoryPage = async ({
  params,
}: {
  params: { categoryId: string, storeId: string };
}) => {
  // Query the billboard from the database
  const category = await prismadb.category.findUnique({
    where: {
      id: params.categoryId, 
    },
  }); 

  
  /**
   * Retrieves the billboards for a specific store.
   *
   * @param {number} storeId - The ID of the store.
   * @returns {Promise<Billboard[]>} - A promise that resolves to an array of billboards.
   */
  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId: params.storeId
    }
  }) 



  return (
    <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
            <CategoryForm 
              initialCategory={category}
              billboards={billboards}
              />
        </div>
    </div>
  )
};

export default CategoryPage;

