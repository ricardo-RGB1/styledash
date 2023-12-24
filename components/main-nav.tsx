"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";



/**
 * Renders the main navigation component.
 * 
 * @component
 * @param {React.HTMLAttributes<HTMLElement>} props - The props for the MainNav component.
 * @param {string} props.className - The CSS class name for the component.
 * @returns {JSX.Element} The rendered MainNav component.
 */
export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>): JSX.Element {
  const pathname = usePathname(); // get the current path
  const params = useParams(); // get the current params object { storeId: string}

  /**
   * Array of route objects.
   * Each route object contains the following properties:
   * - href: string - The URL path for the route.
   * - label: string - The label or name of the route.
   * - active: boolean - Indicates if the route is currently active.
   */
  const routes = [
    {
      href: `/${params.storeId}`,
      label: "Overview",
      active: pathname === `/${params.storeId}`, // check if the current path is the same as the route path
    },
    {
      href: `/${params.storeId}/billboards`,
      label: "Billboards",
      active: pathname === `/${params.storeId}/billboards`, 
    },
    {
      href: `/${params.storeId}/categories`,
      label: "Categories",
      active: pathname === `/${params.storeId}/categories`,
    },
    {
      href: `/${params.storeId}/sizes`,
      label: "Sizes",
      active: pathname === `/${params.storeId}/sizes`,
    },
    {
      href: `/${params.storeId}/colors`,
      label: "Colors",
      active: pathname === `/${params.storeId}/colors`,
    },
    {
      href: `/${params.storeId}/products`,
      label: "Products",
      active: pathname === `/${params.storeId}/products`,
    },
    {
      href: `/${params.storeId}/orders`,
      label: "Orders",
      active: pathname === `/${params.storeId}/orders`,   
    },
    {
      href: `/${params.storeId}/settings`,
      label: "Settings",
      active: pathname === `/${params.storeId}/settings`,
    },
  ];



  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
      {routes.map((route) => ( 
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            route.active
              ? "text-black dark:text-white"
              : "text-muted-foreground"
          )}
        >
          {route.label}
        </Link>
      ))}
     
    </nav>
  );
}

// The MainNav component is typed with React.HTMLAttributes<HTMLElement>. This is a TypeScript interface provided by the React type definitions. It includes all the standard HTML attributes that an HTML element can have, such as className, id, style, etc. This means that you can pass any standard HTML attribute as a prop to the MainNav component.

// The MainNav component takes a destructured props object as its argument. The props object includes a className property and a ...props rest parameter. The className property is used to apply CSS classes to the component, and the ...props rest parameter is used to collect any additional props that are passed to the component.

// Overall, MainNav component can accept any standard HTML attributes as props, making it a flexible and reusable component for building the main navigation of your application.
