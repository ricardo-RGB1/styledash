"use client";

import { z } from "zod";
import toast from "react-hot-toast";
import axios from "axios";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { AlertModal } from "@/components/modals/alert-modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Category, Billboard } from "@prisma/client";

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

/**
 * Props for the CategoryForm component.
 */
interface CategoryFormProps {
  initialCategory: Category | null;
  billboards: Billboard[];
}

// Add form schema here
const formSchema = z.object({
  name: z.string().min(1),
  billboardId: z.string().min(1),
});

// Infer the type of the form values
type CategoryFormValues = z.infer<typeof formSchema>;

/**
 * A form component for managing settings of a store.
 * @component
 * @param {CategoryFormProps} props - The component props.
 * @param {Store} props.initialCategory - The initial billboard object.
 * @returns {JSX.Element} The rendered component.
 */
const CategoryForm: React.FC<CategoryFormProps> = ({
  initialCategory,
  billboards,
}: CategoryFormProps): JSX.Element => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false); // Whether the delete modal is open
  const [loading, setLoading] = useState(false); // Whether the form is loading

  // Add title, description, and separator
  const title = initialCategory ? "Update Category" : "Create Category";
  const description = initialCategory
    ? "Edit your Category"
    : "Add a new Category";
  const toastMessage = initialCategory // The toast message to display
    ? "Category updated."
    : "Category created!";
  const action = initialCategory ? "Save" : "Create";

  /**
   * The form object used for managing settings form data.
   * @template T - The type of the form values.
   */
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialCategory || {
      name: "",
      billboardId: "",
    },
  });

  /**
   * Handles the form submission for creating or updating a billboard.
   *
   * @param values - The form values containing the billboard data.
   */
  const onSubmit = async (values: CategoryFormValues) => {
    try {
      setLoading(true);
      if (initialCategory) {
        await axios.patch(
          `/api/${params.storeId}/categories/${params.categoryId}`,
          values
        );
      } else {
        await axios.post(`/api/${params.storeId}/categories`, values);
      }
      router.refresh();
      router.push(`/${params.storeId}/categories`); // Redirect to the categories page
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
  const onDelete = async (): Promise<void> => {
    try {
      setLoading(true);
      await axios.delete(
        `/api/${params.storeId}/categories/${params.categoryId}`
      );
      router.refresh(); // Refresh the page to get the latest data
      router.push(`/${params.storeId}/categories`);
      toast.success("Category deleted!");
      router.refresh(); // Refresh the page to get the latest data
    } catch (error) {
      toast.error("Make sure you remove all products using this category first.");
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
        label={initialCategory?.name || ""}
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />

        {initialCategory && ( // Only show the delete button if the store exists
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
                      placeholder="Enter a category name"
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="billboardId" // the form field will control the billboardId value
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billboard</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a billboard"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {billboards.map((billboard) => (
                        <SelectItem key={billboard.id} value={billboard.id}>
                          {billboard.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

export default CategoryForm;
