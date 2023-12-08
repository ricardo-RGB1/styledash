"use client";

import { z } from "zod";
import toast from "react-hot-toast";
import axios from "axios";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { AlertModal } from "@/components/modals/alert-modal";
import { ApiAlert } from "@/components/ui/api-alert";
import { Input } from "@/components/ui/input";
import { useOrigin } from "@/hooks/use-origin";

import { Store } from "@prisma/client";
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

interface SettingsFormProps {
  initialStore: Store;
}

// Add form schema here
const formSchema = z.object({
  name: z.string().min(1),
});

// Infer the type of the form values
type SettingsFormValues = z.infer<typeof formSchema>;



/**
 * A form component for managing settings of a store.
 * @component
 * @param {SettingsFormProps} props - The component props.
 * @param {Store} props.initialStore - The initial store object.
 * @returns {JSX.Element} The rendered component.
 */
const SettingsForm: React.FC<SettingsFormProps> = ({
  initialStore,
}: SettingsFormProps): JSX.Element => {
  const params = useParams();
  const router = useRouter();
  const origin = useOrigin();

  const [open, setOpen] = useState(false); // Whether the delete modal is open
  const [loading, setLoading] = useState(false); // Whether the form is loading

  /**
   * The form object used for managing settings form data.
   * @template T - The type of the form values.
   */
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialStore, // Set the default values to the store object
  });

  /**
   * Handles the form submission for updating store settings.
   * @param values - The values from the settings form.
   */
  const onSubmit = async (values: SettingsFormValues) => {
    try {
      setLoading(true);
      await axios.patch(`/api/stores/${params.storeId}`, values);
      router.refresh(); // Refresh the page to get the latest data
      toast.success("Store name updated! ");
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Deletes the store with the specified storeId.
   * @returns {Promise<void>} A promise that resolves when the store is successfully deleted.
   */
  const deleteStore = async (): Promise<void> => {
    try {
      setLoading(true);
      await axios.delete(`/api/stores/${params.storeId}`); // Make a DELETE request to the API
      router.refresh(); // Refresh the page to get the latest data
      router.push("/"); // Redirect to the home page
      toast.success("Store deleted!");
    } catch (error) {
      toast.error("Make sure you removed all products and categories first.");
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
        label={initialStore.name}
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={deleteStore}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading
          title="Settings Title"
          description="Manage store preferences"
        />
        <Button
          disabled={loading}
          onClick={() => setOpen(true)}
          size="icon"
          variant="destructive"
        >
          <Trash className="w-4 h-4" />
        </Button>
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
                      placeholder="Enter store name"
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} type="submit" className="ml-auto">
            Save
          </Button>
        </form>
      </Form>
      <Separator />
      <ApiAlert
        title="NEXT_PUBLIC_API_URL"
        description={`${origin}/api/stores/${params.storeId}}`} // Add the storeId to the URL
        variant="public"
      />
    </>
  );
};

export default SettingsForm;

// The PATCH method is used when you want to apply partial modifications to a resource on the server. In other words, you use PATCH when you want to update only certain fields of a resource.

// The axios.patch function takes two arguments:

// The URL of the resource you want to update. In your case, this is /api/stores/${params.storeId}, where ${params.storeId} is a template literal that will be replaced with the value of params.storeId.

// The second argument to axios.patch, values, is the data that will be sent as the request body to the server. This data will be in JSON format. This data should represent the updates you want to make to the resource. Values is an object containing the new settings for the store.

// For safety features like CSRF protection, you should always use the PATCH method when updating a resource. This is because the PATCH method is idempotent, meaning that it can be called multiple times without causing any additional side effects. This is in contrast to the POST method, which is not idempotent. If you call the POST method multiple times, it will create multiple resources on the server.

// Also, for safety features, I did not use cascade delete in the database, hence the error message in the deleteStore function. This is because cascade delete can be dangerous. If you accidentally delete a resource, you will not be able to recover it. Instead, I used a soft delete, which is a safer alternative. A soft delete marks a resource as deleted, but does not actually delete it from the database. This means that you can recover the resource if you accidentally delete it.
