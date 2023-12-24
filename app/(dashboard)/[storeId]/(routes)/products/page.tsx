import prismadb from "@/lib/prismadb";
import { format } from "date-fns";
import ProductClient from "./components/client";
import { ProductColumn } from "./components/columns";
import { formatter } from "@/lib/utils";

/**
 * Renders the products page for a specific store.
 * 
 * @param params - The parameters for the page, including the storeId.
 * @returns The JSX element representing the products page.
 */
const ProductsPage = async ({ params }: { params: { storeId: string } }) => {

  const products = await prismadb.product.findMany({
    where: {
      storeId: params.storeId,
    },
    include: { // include is used to get the data from the related tables
      category: true,
      size: true,
      color: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });


/**
 * Formats the products array into a new array of ProductColumn objects.
 * 
 * @param products - The array of products to be formatted.
 * @returns The formatted array of ProductColumn objects.
 */
const formattedProducts: ProductColumn[] = products.map((item) => ({
  id: item.id,
  name: item.name,
  isFeatured: item.isFeatured,
  isArchived: item.isArchived,
  price: formatter.format(item.price.toNumber() / 100),
  category: item.category.name,
  size: item.size.name,
  color: item.color.value,
  createdAt: format(item.createdAt, "MMMM do, yyyy"),
}));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductClient data={formattedProducts} />
      </div>
    </div>
  );
};

export default ProductsPage;


// This is a TypeScript React component named ProductsPage. It's an asynchronous function that receives an object with a params property as an argument. The params object contains a storeId property.

// The function makes an asynchronous call to prismadb.product.findMany(), which fetches many product records from a database. The findMany method is configured to only fetch products where the storeId matches the storeId passed in params. It also includes related data from the category, size, and color tables. The fetched products are ordered by their createdAt property in descending order.

// The fetched products are then mapped to a new array of objects, formattedProducts, where each object has properties id, name, isFeatured, isArchived, price, and createdAt. The createdAt property is formatted to a more human-readable date format.

// Finally, the function returns a JSX element, which is a div containing a ProductClient component. The BillboardClient component receives the formattedProducts array as a prop.

// The ProductsPage component is then exported as a default export.