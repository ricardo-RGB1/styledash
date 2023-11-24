import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';

export default async function SetupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in'); 
  }

  const store = await prismadb.store.findFirst({ 
    where: {
      userId,
    }
  });

  // If a store is found, the user is redirected to the dashboard -> storeId layout first, then the store page.
  if (store) { 
    redirect(`/${store.id}`);
  };

  return (
    <>
      {children}
    </>
  );
};

// SetupLayout, is a layout component for a setup process. It is used for pages where the user should be redirected if they already have a store.

// The SetupLayout component receives one prop: children, which is the content to be displayed within the layout.

// The auth function from @clerk/nextjs is used to get the userId of the currently authenticated user. If no user is authenticated, the user is redirected to the "/sign-in" page.

// The prismadb.store.findFirst function is used to find the first store in the database that matches the provided userId. If a matching store is found, the user is redirected to the store page.

// The rendered component is a fragment that includes the children prop. This layout is used for pages where the user should be redirected if they already have a store.