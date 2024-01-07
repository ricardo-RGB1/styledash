'use client';
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import  Separator from "@/components/ui/separator";
import { ProductColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import ApiList from "@/components/ui/api-list";

interface ProductClientProps { 
    data: ProductColumn[]; // an array of ProductColumn objects
}
  
/**
 * Renders the product client component.
 * @param {ProductClientProps} props - The props of the component.
 * @returns {JSX.Element} - The rendered component.
 */
const ProductClient: React.FC<ProductClientProps> = ({
    data
}: ProductClientProps): JSX.Element => {
    const params = useParams();
    const router = useRouter();

    return (  
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Products (${data.length})`}
                    description="Manage products for your store"
                    />
                    <Button onClick={() => router.push(`/${params.storeId}/products/new`)}>
                        <Plus className="mr-2 w-4 h-4" />
                        Add New
                    </Button>
            </div>
            <Separator />
            <DataTable columns={columns} data={data} searchKey='name' />
            <Heading title="API" description="API calls for Products"  />
            <Separator />
            <ApiList entityName="products" entityIdName="productId" /> 
        </>  
     );
}
 
export default ProductClient; 