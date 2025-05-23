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
      "inline-flex items-center justify-center text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

    // Variant classes
    const variantClasses = {
      default:
        "bg-primary text-black hover:bg-primary/90 shadow-sm hover:shadow-md font-bold",
      destructive:
        "bg-destructive text-black hover:bg-destructive/90 font-bold",
      outline:
        "border-2 border-primary text-primary bg-white hover:bg-primary/5 hover:text-primary-600 font-semibold",
      secondary:
        "bg-secondary text-gray-800 hover:bg-secondary/80 font-semibold",
      ghost: "text-gray-800 hover:bg-gray-100 hover:text-primary",
      link: "text-primary hover:text-primary-700 underline-offset-4 hover:underline font-semibold",
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
