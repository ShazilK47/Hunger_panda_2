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
  isAdmin?: boolean;
  onEdit?: (restaurant: Restaurant) => void;
  onDelete?: (id: string) => void;
}

export function RestaurantCard({
  restaurant,
  isAdmin = false,
  onEdit,
  onDelete,
}: RestaurantCardProps) {
  const { id, name, description, imageUrl, address, cuisine, phone } =
    restaurant;

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
          {cuisine && (
            <span className="text-sm font-normal text-gray-500 ml-2">
              {cuisine}
            </span>
          )}
        </CardTitle>
        <CardDescription className="line-clamp-2">
          {description || "No description available"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-2">
        <p className="text-sm text-gray-500">
          <span className="font-medium">Address:</span> {address}
        </p>
        {phone && (
          <p className="text-sm text-gray-500">
            <span className="font-medium">Phone:</span> {phone}
          </p>
        )}
        <div className="flex items-center gap-1 text-yellow-400 mt-3">
          <span>★</span>
          <span>★</span>
          <span>★</span>
          <span>★</span>
          <span>★</span>
          <span className="text-gray-500 text-sm ml-1">5.0</span>
        </div>
      </CardContent>{" "}
      <CardFooter className="pt-4 border-t">
        {isAdmin ? (
          <div className="flex gap-2 w-full">
            <Button
              onClick={() => onEdit?.(restaurant)}
              className="flex-1"
              variant="outline"
            >
              Edit
            </Button>
            <Button
              onClick={() => onDelete?.(id)}
              className="flex-1"
              variant="destructive"
            >
              Delete
            </Button>
          </div>
        ) : (
          <Link href={`/restaurants/${id}`} className="w-full">
            <Button className="w-full rounded-pill transition-all">
              View Menu
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}
