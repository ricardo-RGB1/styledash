"use client";

import * as z from "zod"
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useStoreModal } from "@/hooks/use-store-modal";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  name: z.string().min(1),
});

export const StoreModal = () => {
  const storeModal = useStoreModal();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({ 
    resolver: zodResolver(formSchema),
    defaultValues: { 
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
     const response = await axios.post('/api/stores', values); //  The values object is sent as the request body so we can extract the name value from it.

      window.location.assign(`/${response.data.id}`); // Redirect to the store page.
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Create store"
      description="Add a new store to manage products and categories."
      isOpen={storeModal.isOpen} 
      onClose={storeModal.onClose}
      label={" "}
    >
      <div>
        <div className="space-y-4 py-2 pb-4">
          <div className="space-y-2">
            <Form {...form}> 
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input disabled={loading} placeholder="E-Commerce" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                  <Button disabled={loading} variant="outline" onClick={storeModal.onClose}>
                    Cancel
                  </Button>
                  <Button disabled={loading} type="submit">Continue</Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </Modal>
  );
};



// ************************************************************
// The form schema is defined with zod, requiring a name field that is a string with a minimum length of 1.

// The StoreModal component uses the useStoreModal hook to control the visibility of the modal. It also uses the useForm hook from react-hook-form to manage the form state, with zodResolver to validate the form data against the schema.

// The onSubmit function is called when the form is submitted. It sends a POST request to the /api/stores endpoint with the form values. If the request is successful, it redirects to the new store page and displays a success toast. If the request fails, it displays an error toast.

// The rendered component is a modal with a form containing a single input field for the store name. The form also includes a cancel button that closes the modal and a submit button that submits the form. Both buttons are disabled while the form is being submitted.