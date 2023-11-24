'use client';

import { Copy, Server } from "lucide-react";
import { toast } from "react-hot-toast";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge, BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";



/**
 * Props for the ApiAlert component.
 */
interface ApiAlertProps {
  title: string;
  description: string;
  variant: 'public' | 'admin',
};


/**
 * Mapping of variant values to corresponding text.
 */
const textMap: Record<ApiAlertProps["variant"], string> = { 
    public: 'Public',
    admin: 'Admin'
};
// Record<ApiAlertProps["variant"], string> is used to type the values of the textMap object. This means that the values of textMap should be valid variant values for the ApiAlert component.



/**
 * Maps the variant of the ApiAlert component to the corresponding variant of the Badge component.
 */
const variantMap: Record<ApiAlertProps["variant"], BadgeProps["variant"]> = {  
    public: 'secondary',
    admin: 'destructive'
}; 
// BadgeProps["variant"] is used to type the values of the variantMap object. This means that the values of variantMap should be valid variant values for the Badge component.


/**
 * Renders an API alert component.
 */
export const ApiAlert: React.FC<ApiAlertProps> = ({
    title,
    description,
    variant = "public"
}) => {
    
    /**
     * Copies the description to the clipboard and displays a success toast.
     */
    const onCopy = () => {
        navigator.clipboard.writeText(description); // Copy the description to the clipboard
        toast.success('API Route copied to clipboard.');
    }

    return ( 
        <Alert>
            <Server className="h-4 w-4" />
            <AlertTitle className="flex items-center gap-x-2">
                {title}
                <Badge variant={variantMap[variant]}>  
                    {textMap[variant]} 
                </Badge>
            </AlertTitle>
            <AlertDescription className="mt-4 flex items-center justify-between">
                <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                    {description}
                </code>
                <Button variant="outline" size="sm" onClick={onCopy}>
                    <Copy className="h-4 w-4" />
                </Button>
            </AlertDescription>
        </Alert>
     );
};