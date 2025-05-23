import * as React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "default",
      size = "default",
      children,
      ...props
    },
    ref
  ) => {
    // Base classes
    const baseClasses =
      "inline-flex items-center justify-center text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"; // Variant classes
    const variantClasses = {
      default:
        "bg-primary text-white hover:bg-primary/90 shadow-sm hover:shadow-md",
      destructive: "bg-destructive text-white hover:bg-destructive/90",
      outline:
        "border-2 border-primary text-primary dark:text-white bg-transparent hover:bg-primary/5",
      secondary:
        "bg-secondary text-secondary-foreground dark:text-gray-800 hover:bg-secondary/80",
      ghost: "text-gray-700 dark:text-white hover:bg-accent hover:text-white",
      link: "text-primary dark:text-primary-200 underline-offset-4 hover:underline",
    };

    // Size classes
    const sizeClasses = {
      default: "h-10 px-4 py-2 rounded-md",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10 rounded-full",
    };

    // Apply rounded-pill class if it's in the className
    const hasRoundedPill = className.includes("rounded-pill");
    const roundedClass = hasRoundedPill ? "rounded-full" : "";

    const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${
      sizeClasses[size]
    } ${roundedClass} ${className.replace("rounded-pill", "")}`;

    return (
      <button className={combinedClasses} ref={ref} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
