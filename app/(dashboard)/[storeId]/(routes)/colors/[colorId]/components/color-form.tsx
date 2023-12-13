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


import { Color } from "@prisma/client";
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

interface ColorFormProps {
  initialColor: Color | null;
}

// Add form schema here
const formSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(4).regex(/^#/, {
    message: "Value must be a valid hex color code."
  }),
});

// Infer the type of the form values
type ColorFormValues = z.infer<typeof formSchema>;


/**
 * A form component for creating or updating a Size.
 * 
 * @component
 * @param {Size | null} initialColor - The initial Size object to populate the form with. If null, the form will be in create mode.
 * @returns {JSX.Element} The ColorForm component.
 */
const ColorForm: React.FC<ColorFormProps> = ({
  initialColor, 
}: ColorFormProps): JSX.Element => {
  const params = useParams();
  const router = useRouter();
 

  const [open, setOpen] = useState(false); // Whether the delete modal is open
  const [loading, setLoading] = useState(false); // Whether the form is loading

  // Add title, description, and separator
  const title = initialColor ? "Update color" : "Create color";
  const description = initialColor
    ? "Edit your color"
    : "Add a new color";
  const toastMessage = initialColor
    ? "Color updated."
    : "Color created!";
  const action = initialColor ? "Save" : "Create";

  /**
   * The form object used for managing settings form data.
   * @template T - The type of the form values.
   */
  const form = useForm<ColorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialColor || {
      name: "",
      value: "",
    },
  });



  /**
   * Handles the form submission for creating or updating a color.
   * 
   * @param values - The form values containing the color data.
   */
  const onSubmit = async (values: ColorFormValues) => {
    try {
      setLoading(true);
      if (initialColor) { 
        await axios.patch(`/api/${params.storeId}/colors/${params.colorId}`, values); 
      } else {
        await axios.post(`/api/${params.storeId}/colors`, values);
      } 
      router.refresh();
      router.push(`/${params.storeId}/colors`); // Redirect to the colors page
      toast.success(toastMessage);
      router.refresh(); // Refresh the page to get the latest data
    } catch (error) { 
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };


  /**
   * Deletes a color from the store.
   * @returns A promise that resolves when the color is successfully deleted.
   */
  const deleteStore = async (): Promise<void> => {
    try {
      setLoading(true); 
      await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`); 
      router.refresh(); // Refresh the page to get the latest data
      router.push(`/${params.storeId}/colors`);
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
    // Add title, description, and separator
    <>
      {/*  Add delete modal here */}
      <AlertModal
        label={initialColor?.name || ""}
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={deleteStore}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />

        {initialColor && ( // Only show the delete button if the store exists
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
                      placeholder="Enter a color"
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
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-x-4">
                      <Input
                        {...field}
                        placeholder="Enter a value, e.g, #7EC8E3"
                        disabled={loading}
                      />
                      <div className="border p-4 rounded-full" style={{backgroundColor: field.value}} />
                    </div>
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

export default ColorForm;


