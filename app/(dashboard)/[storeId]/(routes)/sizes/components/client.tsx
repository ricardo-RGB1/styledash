'use client';
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { SizeColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import ApiList from "@/components/ui/api-list";

interface SizeClientProps {
    data: SizeColumn[]; 
}
  
/**
 * Renders the billboard client component.
 * @param {SizeClientProps} props - The props of the component.
 * @returns {JSX.Element} - The rendered component.
 */
const SizeClient: React.FC<SizeClientProps> = ({
    data
}: SizeClientProps): JSX.Element => {
    const params = useParams();
    const router = useRouter();

    return (  
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Sizes (${data.length})`}
                    description="Manage sizes for your store"
                    />
                    <Button onClick={() => router.push(`/${params.storeId}/sizes/new`)}>
                        <Plus className="mr-2 w-4 h-4" />
                        Add New
                    </Button>
            </div>
            <Separator />
            <DataTable columns={columns} data={data} searchKey='name' />
            <Heading title="API" description="API calls for Sizes"  />
            <Separator />
            <ApiList entityName="sizes" entityIdName="sizeId" /> 
        </>  
     );
}
 
export default SizeClient;