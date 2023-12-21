import prismadb from "@/lib/prismadb";
import { format } from "date-fns";
import SizeClient from "./components/client";
import { SizeColumn } from "./components/columns";



const SizesPage = async ({ params }: { params: { storeId: string } }) => {

  /**
   * Retrieves the sizes for a specific store.
   *
   * @returns An array of sizes.
   */
  const sizes = await prismadb.size.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

 
  // The sizes array is then mapped to a new array of objects, formattedSizes, where each object has properties id, name, value, and createdAt. The createdAt property is formatted to a more human-readable date format.
  const formattedSizes: SizeColumn[] = sizes.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  })); 

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeClient data={formattedSizes} /> 
      </div>
    </div>
  );
};

export default SizesPage;


// The formattedSizes array is likely defined in the page.tsx file because it's directly related to the data manipulation needed for the specific page component defined in this file.

// The client.tsx file, on the other hand, might be a more generic component used across different parts of the application. It might not be aware of the specific data manipulation needs of each individual page, such as the formatting of createdAt to a human-readable date format.

// By defining formattedSizes in the page.tsx file, the specific data formatting logic is kept close to where it's used, making the code easier to understand and maintain. It also keeps the client.tsx file more generic and reusable.