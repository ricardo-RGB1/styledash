"use client";
import { useParams, useRouter } from "next/navigation";
import Heading from "@/components/ui/heading";
import  Separator from "@/components/ui/separator";
import { OrderColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";


/**
 * Props for the OrderClient component.
 */
interface OrderClientProps {
    data: OrderColumn[]; // an array of OrderColumn objects
}


/**
 * Renders the column client component.
 * @param {OrderClientProps} props - The props of the component.
 * @returns {JSX.Element} - The rendered component.
 */
const OrderClient: React.FC<OrderClientProps> = ({
  data,
}: OrderClientProps): JSX.Element => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <Heading
        title={`Orders (${data.length})`}
        description="Manage orders for your store"
      />

      <Separator />
      <DataTable columns={columns} data={data} searchKey="products" />
    </>
  );
};

export default OrderClient;
