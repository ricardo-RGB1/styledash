import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";
import Navbar from "@/components/navbar";

/**
 * Renders the layout for the dashboard page.
 *
 * @param children - The content to be rendered within the layout.
 * @param params - The parameters for the layout, including the storeId.
 * @returns The rendered layout component.
 */
export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { storeId: string };
}) {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
      userId,
    },
  });

  if (!store) {
    redirect("/");
  }

  return (
    <>
      <Navbar />
      {children} {/* children prop is the DashboardPage component -> (routes) folder */}
    </>
  );
} 

// The DashboardLayout component receives two props: children and params. children is the content to be displayed within the layout, and params is an object containing a storeId string.

// The auth function from @clerk/nextjs is used to get the userId of the currently authenticated user. If no user is authenticated, the user is redirected to the "/sign-in" page.

// The prismadb.store.findFirst function is used to find the first store in the database that matches the provided storeId and userId. If a store is found, the user is redirected to the store page. If no matching store is found, the user is redirected to the home page ("/").

// The rendered component is a fragment that includes the children prop. This layout is used for pages that require a storeId and should only be accessible to users who have a store with the provided storeId.
