"use client";

import { z } from "zod";
import toast from "react-hot-toast";
import axios from "axios";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import  Separator  from "@/components/ui/separator";
import { AlertModal } from "@/components/modals/alert-modal";
import ImageUpload from "@/components/ui/image-upload";

import { Input } from "@/components/ui/input";


import { Billboard } from "@prisma/client";
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

interface BillboardFormProps {
  initialBillboard: Billboard | null;
}

// Add form schema here
const formSchema = z.object({
  label: z.string().min(1),
  imageUrl: z.string().min(1),
});

// Infer the type of the form values
type BillboardFormValues = z.infer<typeof formSchema>;

/**
 * A form component for managing settings of a store.
 * @component
 * @param {BillboardFormProps} props - The component props.
 * @param {Store} props.initialBillboard - The initial billboard object.
 * @returns {JSX.Element} The rendered component.
 */
const BillboardForm: React.FC<BillboardFormProps> = ({
  initialBillboard, 
}: BillboardFormProps): JSX.Element => {
  const params = useParams();
  const router = useRouter();
 

  const [open, setOpen] = useState(false); // Whether the delete modal is open
  const [loading, setLoading] = useState(false); // Whether the form is loading

  // Add title, description, and separator
  const title = initialBillboard ? "Update billboard" : "Create billboard";
  const description = initialBillboard
    ? "Edit your billboard"
    : "Add a new billboard";
  const toastMessage = initialBillboard
    ? "Billboard updated."
    : "Billboard created!";
  const action = initialBillboard ? "Save" : "Create";

  /**
   * The form object used for managing settings form data.
   * @template T - The type of the form values.
   */
  const form = useForm<BillboardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialBillboard || {
      label: "",
      imageUrl: "",
    },
  });



  /**
   * Handles the form submission for creating or updating a billboard.
   * 
   * @param values - The form values containing the billboard data.
   */
  const onSubmit = async (values: BillboardFormValues) => {
    try {
      setLoading(true);
      if (initialBillboard) { 
        await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`, values); 
      } else {
        await axios.post(`/api/${params.storeId}/billboards`, values);
      } 
      router.refresh();
      router.push(`/${params.storeId}/billboards`); // Redirect to the billboards page
      toast.success(toastMessage);
      router.refresh(); // Refresh the page to get the latest data
    } catch (error) { 
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };  


  /**
   * Deletes a billboard from the store.
   * @returns A promise that resolves when the billboard is successfully deleted.
   */
  const deleteStore = async (): Promise<void> => {
    try {
      setLoading(true); 
      await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`); 
      router.refresh(); // Refresh the page to get the latest data
      router.push(`/${params.storeId}/billboards`);
      toast.success("Billboard deleted!");
      router.refresh(); // Refresh the page to get the latest data
    } catch (error) {
      toast.error("Make sure you removed all categories first.");
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
        label={initialBillboard?.label || ""}
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={deleteStore}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />

        {initialBillboard && ( // Only show the delete button if the store exists
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
          {" "}
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background image</FormLabel>
                <FormControl>
                  <ImageUpload
                    {...field}
                    disabled={loading}
                    onChange={(url) => field.onChange(url)} // Update the value
                    onRemove={() => field.onChange("")} // Clear the value
                    value={field.value ? [field.value] : []} // Convert the value to an array
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter a billboard label"
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

export default BillboardForm;

// The PATCH method is used when you want to apply partial modifications to a resource on the server. In other words, you use PATCH when you want to update only certain fields of a resource.

// The axios.patch function takes two arguments:

// The URL of the resource you want to update. In your case, this is /api/stores/${params.storeId}, where ${params.storeId} is a template literal that will be replaced with the value of params.storeId.

// The second argument to axios.patch, values, is the data that will be sent as the request body to the server. This data will be in JSON format. This data should represent the updates you want to make to the resource. Values is an object containing the new settings for the store.

// For safety features like CSRF protection, you should always use the PATCH method when updating a resource. This is because the PATCH method is idempotent, meaning that it can be called multiple times without causing any additional side effects. This is in contrast to the POST method, which is not idempotent. If you call the POST method multiple times, it will create multiple resources on the server.

// Also, for safety features, I did not use cascade delete in the database, hence the error message in the deleteStore function. This is because cascade delete can be dangerous. If you accidentally delete a resource, you will not be able to recover it. Instead, I used a soft delete, which is a safer alternative. A soft delete marks a resource as deleted, but does not actually delete it from the database. This means that you can recover the resource if you accidentally delete it.
