"use client";

import axios from "axios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColorColumn } from "./columns";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { AlertModal } from "@/components/modals/alert-modal";

interface CellActionProps {
  data: ColorColumn;
}

// The CellAction component will be used in the columns.tsx file and function as a button to edit the size.
export const CellAction: React.FC<CellActionProps> = ({ data }) => {

    const router = useRouter();
    const params = useParams(); 

    const [open, setOpen] = useState(false); 
    const [loading, setLoading] = useState(false);


    const onCopy = (id: string) => {
        navigator.clipboard.writeText(id); 
        toast.success('Color id copied to clipboard.');
    }

    const deleteSize = async (): Promise<void> => {
        try {
          setLoading(true); 
          await axios.delete(`/api/${params.storeId}/colors/${data.id}`); 
          router.refresh(); // Refresh the page to get the latest data
          toast.success("Color deleted!");
          router.refresh(); // Refresh the page to get the latest data
        } catch (error) {
          toast.error("Make sure you removed all products using this color first.");
        } finally {
          setLoading(false);
          setOpen(false); // Close the modal
        }
      };


  return (
    <>
        <AlertModal     
              label={""}
              isOpen={open}
              onConfirm={deleteSize}
              onClose={() => setOpen(false)}
              loading={loading} 
            />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onCopy(data.id)}>
              <Copy className="mr-2 h-4 w-4" />
              Copy
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/${params.storeId}/colors/${data.id}`)}>
              <Edit className="mr-2 h-4 w-4" />
              Update
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setOpen(true)}>
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
    </>
  );
};

export default CellAction;
