import { UserButton, auth } from "@clerk/nextjs";
import { MainNav } from "./main-nav";
import StoreSwitcher from "./store-switcher";
import { redirect } from "next/navigation";
import prismadb from "@/lib/prismadb";
import { ModeToggle } from "./theme-toggle";

const Navbar = async () => {
  const {userId} = auth(); 

  // redirect to the sign-in page if the user is not signed in
  if (!userId) {
    redirect('/sign-in');
  }

  // get the stores from the database
  const stores = await prismadb.store.findMany({ 
    where: {
      userId: userId // get the stores that belong to the current user
    }
  }); 
 
    return ( 
        <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <StoreSwitcher items={stores} />
          <MainNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <ModeToggle />
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </div>
     ); 
}
 
export default Navbar;  