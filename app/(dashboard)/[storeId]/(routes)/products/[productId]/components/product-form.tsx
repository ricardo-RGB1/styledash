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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Product, Image, Category, Color, Size } from "@prisma/client";
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
 * Props for the ProductForm component.
 * Include the intersection type of Product and an object with an images property that is an array of Image objects.
 */
interface ProductFormProps {
  initialProduct:
    | (Product & {
        images: Image[]; // The images property is an array of Image objects
      })
    | null;
  categories: Category[];
  sizes: Size[];
  colors: Color[];
}

/**
 * Defines the form schema for the product form.
 * images - an array of objects, where each object has a url property that is a string. This means that the form should allow the user to input one or more images, each represented by a URL: exm: [{url: 'https://example.com/image1.jpg'}, {url: 'https://example.com/image2.jpg'}]
 */
const formSchema = z.object({
  name: z.string().min(1),
  images: z.object({ url: z.string() }).array(),
  price: z.coerce.number().min(1),
  categoryId: z.string().min(1),
  colorId: z.string().min(1),
  sizeId: z.string().min(1),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
});

// Infer the type of the form values
type ProductFormValues = z.infer<typeof formSchema>;

/**
 * A form component for managing settings of a store.
 * @component
 * @param {ProductFormProps} props - The component props.
 * @param {Store} props.initialProduct - The initial product object.
 * @returns {JSX.Element} The rendered component.
 */
const ProductForm: React.FC<ProductFormProps> = ({
  categories,
  sizes,
  colors,
  initialProduct,
}: ProductFormProps): JSX.Element => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false); // Whether the delete modal is open
  const [loading, setLoading] = useState(false); // Whether the form is loading

  // Add title, description, and separator
  const title = initialProduct ? "Update product" : "Create product";
  const description = initialProduct
    ? "Edit your product"
    : "Add a new product";
  const toastMessage = initialProduct ? "Product updated." : "Product created!";
  const action = initialProduct ? "Save" : "Create";

  /**
   * Represents a form for creating or editing a product.
   *
   * @remarks
   * This form uses the useForm hook from react-hook-form library.
   *
   * @param initialProduct - The initial product object to populate the form with.
   * @returns The form object with resolver and default values.
   */
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialProduct
      ? {
          ...initialProduct, // Spread the initial product object
          price: parseFloat(String(initialProduct?.price)), // Convert the price to a number
        }
      : {
          // If there is no initial product, then use the default values
          name: "",
          images: [],
          price: 0,
          categoryId: "",
          colorId: "",
          sizeId: "",
          isFeatured: false,
          isArchived: false,
        },
  });

  /**
   * Handles the form submission for creating or updating a billboard.
   *
   * @param values - The form values containing the billboard data.
   */
  const onSubmit = async (values: ProductFormValues) => {
    try {
      setLoading(true);
      if (initialProduct) {
        await axios.patch(
          `/api/${params.storeId}/billboards/${params.billboardId}`,
          values
        );
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
      await axios.delete(
        `/api/${params.storeId}/billboards/${params.billboardId}`
      );
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
        label={initialProduct?.name || ""}
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={deleteStore}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />

        {initialProduct && ( // Only show the delete button if the store exists
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
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <ImageUpload
                    // The value is an array of image URLs that are strings
                    value={field.value.map((image) => image.url)}
                    disabled={loading}
                    onChange={(url) =>
                      field.onChange([...field.value, { url }])
                    }
                    onRemove={(url) =>
                      field.onChange([
                        ...field.value.filter((current) => current.url !== url),
                      ])
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
                      placeholder="Enter a product name"
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      placeholder="9.99"
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
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
                          placeholder="Select a category"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sizeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size</FormLabel>
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
                          placeholder="Select a size"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sizes.map((size) => (
                        <SelectItem key={size.id} value={size.id}>
                          {size.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="colorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
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
                          placeholder="Select a color"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {colors.map((color) => (
                        <SelectItem key={color.id} value={color.id}>
                          {color.name}
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

export default ProductForm;

// The onRemove function takes a url as an argument - the identifier for a specific image in a list of images.

// Inside the function, field.onChange is called. field is an object and onChange is a method that updates the value of the field.

// The argument to onChange is a new array that is created by filtering the current value of the field (field.value). The filter method is called on field.value, which is expected to be an array. The filter method creates a new array that includes all elements for which the provided filtering function returns true.

// The filtering function takes current as an argument, which represents the current element being processed in the array. The function checks if current.url is not equal to url. This means that it filters out the object with the url that matches the url passed to the onRemove function.

// In other words, when onRemove is called with a specific url, it removes the object with that url from the field.value array.
