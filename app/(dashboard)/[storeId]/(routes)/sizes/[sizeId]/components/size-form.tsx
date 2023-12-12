"use client";

import { z } from "zod";
import toast from "react-hot-toast";
import axios from "axios";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { AlertModal } from "@/components/modals/alert-modal";
import ImageUpload from "@/components/ui/image-upload";

import { Input } from "@/components/ui/input";


import { Size } from "@prisma/client";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useParams, useRouter } from "next/navigation";

interface SizeFormProps {
  initialSize: Size | null;
}

// Add form schema here
const formSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(1),
});

// Infer the type of the form values
type SizeFormValues = z.infer<typeof formSchema>;


/**
 * A form component for creating or updating a Size.
 * 
 * @component
 * @param {Size | null} initialSize - The initial Size object to populate the form with. If null, the form will be in create mode.
 * @returns {JSX.Element} The SizeForm component.
 */
const SizeForm: React.FC<SizeFormProps> = ({
  initialSize, 
}: SizeFormProps): JSX.Element => {
  const params = useParams();
  const router = useRouter();
 

  const [open, setOpen] = useState(false); // Whether the delete modal is open
  const [loading, setLoading] = useState(false); // Whether the form is loading

  // Add title, description, and separator
  const title = initialSize ? "Update size" : "Create size";
  const description = initialSize
    ? "Edit your size"
    : "Add a new size";
  const toastMessage = initialSize
    ? "Size updated."
    : "Size created!";
  const action = initialSize ? "Save" : "Create";

  /**
   * The form object used for managing settings form data.
   * @template T - The type of the form values.
   */
  const form = useForm<SizeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialSize || {
      name: "",
      value: "",
    },
  });



  /**
   * Handles the form submission for creating or updating a size.
   * 
   * @param values - The form values containing the size data.
   */
  const onSubmit = async (values: SizeFormValues) => {
    try {
      setLoading(true);
      if (initialSize) { 
        await axios.patch(`/api/${params.storeId}/sizes/${params.sizeId}`, values); 
      } else {
        await axios.post(`/api/${params.storeId}/sizes`, values);
      } 
      router.refresh();
      router.push(`/${params.storeId}/sizes`); // Redirect to the sizes page
      toast.success(toastMessage);
    } catch (error) { 
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };


  /**
   * Deletes a size from the store.
   * @returns A promise that resolves when the size is successfully deleted.
   */
  const deleteStore = async (): Promise<void> => {
    try {
      setLoading(true); 
      await axios.delete(`/api/${params.storeId}/sizes/${params.sizeId}`); 
      router.refresh(); // Refresh the page to get the latest data
      router.push(`/${params.storeId}/sizes`);
      toast.success("Size deleted!");
    } catch (error) {
      toast.error("Make sure you removed all products using this size first.");
    } finally {
      setLoading(false);
      setOpen(false); // Close the modal
    }
  };

  return (
    // Add title, description, and separator
    <>
      {/*  Add delete modal here */}
      <AlertModal
        label={initialSize?.name || ""}
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={deleteStore}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />

        {initialSize && ( // Only show the delete button if the store exists
          <Button
            disabled={loading}
            onClick={() => setOpen(true)}
            size="icon"
            variant="destructive"
          >
            <Trash className="w-4 h-4" />
          </Button>
        )}
      </div>

      <Separator />
      {/* Add form here */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter a size"
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="value" 
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter a value"
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} type="submit" className="ml-auto">
            {action}
          </Button>
        </form>
      </Form> 
    </>
  );
};

export default SizeForm;


