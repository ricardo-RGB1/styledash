import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import prismadb from "@/lib/prismadb";
import SettingsForm from "./_components/settings-form";

interface SettingsPageProps {
    params: {
        storeId: string;
    };  
}

const SettingsPage: React.FC<SettingsPageProps> = async ({ 
    params
}) => {
    const { userId } = auth();

    if (!userId) {
        redirect('/sign-in');
    }

     /**
     * Represents the store object retrieved from the database.
     * Add a where clause to only find the store if the user owns it
     */
    const store = await prismadb.store.findFirst({ 
        where: {
            id: params.storeId, // storeId is the dynamic route parameter
            userId
        }
    }); 

    /**
     * If the store is not found, redirect to the dashboard
     */
    if (!store) {
        redirect('/dashboard');
    }



    return ( 
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <SettingsForm initialStore={store} />
                
            </div>
        </div>
     );
}
 
export default SettingsPage;