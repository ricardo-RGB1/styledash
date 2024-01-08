import getRevenueForGraph from "@/actions/get-graph-revenue";
import getTotalProductsInStock from "@/actions/get-stock-count";
import getTotalRevenue from "@/actions/get-total-revenue";
import getNumberOfSales from "@/actions/get-total-sales";
import Overview from "@/components/overview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Heading from "@/components/ui/heading";
import Separator from "@/components/ui/separator";

import prismadb from "@/lib/prismadb";
import { formatter } from "@/lib/utils";
import { CreditCard, DollarSign, Package } from "lucide-react";

interface DashboardPageProps {
  params: { storeId: string };
}

const DashboardPage: React.FC<DashboardPageProps> = async ({ params }) => {
  // Functions for total revenue, number of sales, and total products in stock
  const totalRevenue = await getTotalRevenue(params.storeId);
  const numberOfSales = await getNumberOfSales(params.storeId);
  const totalProductsInStock = await getTotalProductsInStock(params.storeId);
  const graphRevenue = await getRevenueForGraph(params.storeId);

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        {/* Display Dashboard title and subtitle */}
        <Heading title="Dashboard" description="Overview of your store" />
        <Separator />

        {/* Display the 3 cards  */}
        <div className="grid gap-4 grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-md font-medium text-slate-500">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-8 w-8 text-muted-foreground text-emerald-700" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatter.format(totalRevenue)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-md font-medium text-slate-500">
                Number of Sales
              </CardTitle>
              <CreditCard className="h-8 w-8 text-muted-foreground text-violet-700" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+ {numberOfSales}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-md font-medium text-slate-500">
                Total Products In Stock
              </CardTitle>
              <Package className="h-8 w-8 text-muted-foreground text-amber-700" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProductsInStock}</div>
            </CardContent>
          </Card>
        </div>
          
          {/* Display the overview card */}
        <Card className="col-span-4">
          <CardHeader> 
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview data={graphRevenue} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
