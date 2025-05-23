import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardImage,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Restaurant } from "@/lib/types/restaurant";

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const { id, name, description, imageUrl, address } = restaurant;

  // Default image if none provided
  const displayImage =
    imageUrl ||
    "https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80";

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all hover:shadow-hover group">
      <CardImage src={displayImage} alt={name} />
      <CardHeader>
        <CardTitle className="font-serif group-hover:text-primary transition-colors">
          {name}
        </CardTitle>
        <CardDescription className="line-clamp-2">
          {description || "No description available"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-gray-500">
          <span className="font-medium">Address:</span> {address}
        </p>
        <div className="flex items-center gap-1 text-yellow-400 mt-3">
          <span>★</span>
          <span>★</span>
          <span>★</span>
          <span>★</span>
          <span>★</span>
          <span className="text-gray-500 text-sm ml-1">5.0</span>
        </div>
      </CardContent>
      <CardFooter className="pt-4 border-t">
        <Link href={`/restaurants/${id}`} className="w-full">
          <Button className="w-full rounded-pill transition-all">
            View Menu
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
