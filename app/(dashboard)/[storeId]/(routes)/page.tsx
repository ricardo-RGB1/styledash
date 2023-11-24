import prismadb from "@/lib/prismadb";

interface DashboardPageProps {
  params: { storeId: string }; 
}

const DashboardPage: React.FC<DashboardPageProps> = async ({ params }) => {

  const store = await prismadb.store.findFirst({ 
    where: {
      id: params.storeId // The storeId is extracted from the params object and used to find the store in the database.
    },
  });

  return (
   <div>
        Store: {store?.name} 
   </div>
   )
};

export default DashboardPage;
