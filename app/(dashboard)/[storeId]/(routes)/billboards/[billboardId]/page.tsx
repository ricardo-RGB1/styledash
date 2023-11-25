import prismadb from "@/lib/prismadb";
import BillboardForm from "./components/billboard-form";

const BillboardPage = async ({
  params,
}: {
  params: { billboardId: string };
}) => {
  // Query the billboard from the database
  const billboard = await prismadb.billboard.findUnique({
    where: {
      id: params.billboardId, 
    },
  }); 
  // params.billboardId should be "new" since there is no billboard yet. I will use this fact to trigger the creation of a new billboard, rather than upadting an existing one. If the billboardId is matched, then I will trigger an option to update the billboard.

  return (
    <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
            <BillboardForm initialBillboard={billboard} />
        </div>
    </div>
  )
};

export default BillboardPage;
