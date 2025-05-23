import { Metadata } from "next";
import { getRestaurantById } from "@/lib/actions/restaurant";

interface RestaurantMetadataProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params,
}: RestaurantMetadataProps): Promise<Metadata> {
  const restaurant = await getRestaurantById(params.id);

  if (!restaurant) {
    return {
      title: "Restaurant Not Found | Hungry Panda",
      description: "The restaurant you're looking for doesn't exist",
    };
  }

  return {
    title: `${restaurant.name} | Hungry Panda`,
    description: restaurant.description || `Order from ${restaurant.name}`,
  };
}
