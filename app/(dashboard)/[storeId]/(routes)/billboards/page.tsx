import prismadb from "@/lib/prismadb";
import { format } from "date-fns";
import BillboardClient from "./components/client";
import { BillboardColumn } from "./components/columns";

// This page renders all your store's billboards. It is the parent page of the billboard page. Query all billboards from the database that belong to the store with the storeId that is passed in the params and order them by the date they were created.I will use this to render all the billboards that belong to the store.
const BillboardsPage = async ({ params }: { params: { storeId: string } }) => {
  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });


  /**
   * Represents an array of formatted billboards.
   * @type {BillboardColumn[]}
   */
  // formats the billboards to be of type BillboardColumn and store them in the formattedBillboards variable.
  const formattedBillboards: BillboardColumn[] = billboards.map((item) => ({
    id: item.id,
    label: item.label,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  })); 

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClient data={formattedBillboards} />
      </div>
    </div>
  );
};

export default BillboardsPage;
