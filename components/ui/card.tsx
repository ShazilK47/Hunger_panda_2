import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import Image from "next/image";
import { defaultImageProps, getImageUrl } from "@/lib/utils/image-utils";

interface CardProps {
  className?: string;
  children: ReactNode;
}

export function Card({ className, children }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-white shadow-card transition-all duration-300",
        className
      )}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  className?: string;
  children: ReactNode;
}

export function CardHeader({ className, children }: CardHeaderProps) {
  return (
    <div className={cn("flex flex-col space-y-1.5 p-6", className)}>
      {children}
    </div>
  );
}

interface CardTitleProps {
  className?: string;
  children: ReactNode;
}

export function CardTitle({ className, children }: CardTitleProps) {
  return (
    <h3
      className={cn(
        "text-xl font-semibold leading-none tracking-tight",
        className
      )}
    >
      {children}
    </h3>
  );
}

interface CardDescriptionProps {
  className?: string;
  children: ReactNode;
}

export function CardDescription({ className, children }: CardDescriptionProps) {
  return <p className={cn("text-sm text-slate-500", className)}>{children}</p>;
}

interface CardContentProps {
  className?: string;
  children: ReactNode;
}

export function CardContent({ className, children }: CardContentProps) {
  return <div className={cn("p-6 pt-0", className)}>{children}</div>;
}

interface CardFooterProps {
  className?: string;
  children: ReactNode;
}

export function CardFooter({ className, children }: CardFooterProps) {
  return (
    <div className={cn("flex items-center p-6 pt-0", className)}>
      {children}
    </div>
  );
}

interface CardImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function CardImage({ src, alt, className }: CardImageProps) {
  return (
    <div
      className={cn(
        "w-full h-48 overflow-hidden rounded-t-xl relative",
        className
      )}
    >
      {/* Using next/image for better optimization */}
      <div className="relative w-full h-full bg-gray-100">
        <Image
          src={getImageUrl(src, "restaurantDefault")}
          alt={alt}
          fill
          className="object-cover transition-transform hover:scale-105 duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          quality={75}
          loading="lazy"
          placeholder="blur"
          blurDataURL={defaultImageProps.blurDataURL}
          data-fallback-type="restaurantDefault"
          onError={defaultImageProps.onError}
        />
      </div>
    </div>
  );
}
