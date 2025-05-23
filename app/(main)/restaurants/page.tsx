import { getRestaurants } from "@/lib/actions/restaurant";
import { RestaurantList } from "@/components/restaurant/restaurant-list";

export const metadata = {
  title: "Restaurants | Hungry Panda",
  description: "Browse and order from our partner restaurants",
};

export default async function RestaurantsPage() {
  const restaurants = await getRestaurants();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Browse Restaurants
          </h1>
          <p className="text-lg text-gray-600">
            Find your favorite food from our partner restaurants
          </p>
        </div>

        <RestaurantList restaurants={restaurants} />
      </div>
    </div>
  );
}
