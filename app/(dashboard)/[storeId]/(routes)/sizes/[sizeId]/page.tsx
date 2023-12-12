import prismadb from "@/lib/prismadb";
import SizeForm from "./components/size-form";


const SizePage = async ({
  params,
}: {
  params: { sizeId: string };
}) => {
  

  /**
   * Retrieves the size information from the database.
   *
   * @param {string} params.sizeId - The ID of the size.
   * @returns {Promise<Size>} The size object.
   */
  const size = await prismadb.size.findUnique({
    where: {
      id: params.sizeId, 
    },
  });

  return (
    <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
            <SizeForm initialSize={size} />
        </div>
    </div>
  )
};

export default SizePage;

