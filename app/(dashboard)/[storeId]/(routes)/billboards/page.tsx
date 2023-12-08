import prismadb from "@/lib/prismadb";
import BillboardClient from "./components/client";


// This page renders all your store's billboards. It is the parent page of the billboard page.
const BillboardsPage = async ({ params }: { params: { storeId: string } }) => {  
// Query all billboards from the database that belong to the store with the storeId that is passed in the params and order them by the date they were created.I will use this to render all the billboards that belong to the store.
const billboards = await prismadb.billboard.findMany({ 
    where: {
        storeId: params.storeId,
    },
    orderBy: {
        createdAt: "desc",
    },
});

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClient data={billboards}  />
      </div>
    </div>
  );
};

export default BillboardsPage;

