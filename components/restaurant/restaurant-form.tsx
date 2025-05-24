"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createRestaurant, updateRestaurant } from "@/lib/actions/restaurant";
import { isRestaurantError, isValidationError } from "@/lib/types/errors";

interface RestaurantFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  initialData?: {
    id?: string;
    name: string;
    description: string;
    address: string;
    imageUrl: string;
    phone: string;
    cuisine: string;
  };
}

export default function RestaurantForm({
  onSuccess,
  onCancel,
  initialData,
}: RestaurantFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    address: initialData?.address || "",
    imageUrl: initialData?.imageUrl || "",
    phone: initialData?.phone || "",
    cuisine: initialData?.cuisine || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFormErrors({});

    try {
      if (initialData?.id) {
        await updateRestaurant(initialData.id, formData);
      } else {
        await createRestaurant(formData);
      }
      onSuccess();
    } catch (err) {
      console.error("Error saving restaurant:", err);
      if (isValidationError(err)) {
        if (err.field) {
          setFormErrors({ [err.field]: err.message });
        } else {
          setError(err.message);
        }
      } else if (isRestaurantError(err)) {
        if (err.code === "UNAUTHORIZED") {
          setError("You are not authorized to perform this action.");
        } else {
          setError(err.message);
        }
      } else {
        setError("Failed to save restaurant. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded mb-4">{error}</div>
      )}

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Restaurant Name *
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
          className={`mt-1 block w-full rounded-md border ${
            formErrors.name ? "border-red-500" : "border-gray-300"
          } px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary`}
          required
          minLength={2}
          maxLength={100}
        />
        {formErrors.name && (
          <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description *
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          className={`mt-1 block w-full rounded-md border ${
            formErrors.description ? "border-red-500" : "border-gray-300"
          } px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary`}
          rows={3}
          required
          maxLength={500}
        />
        {formErrors.description && (
          <p className="mt-1 text-sm text-red-500">{formErrors.description}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="address"
          className="block text-sm font-medium text-gray-700"
        >
          Address *
        </label>
        <input
          type="text"
          id="address"
          value={formData.address}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, address: e.target.value }))
          }
          className={`mt-1 block w-full rounded-md border ${
            formErrors.address ? "border-red-500" : "border-gray-300"
          } px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary`}
          required
          minLength={5}
          maxLength={200}
        />
        {formErrors.address && (
          <p className="mt-1 text-sm text-red-500">{formErrors.address}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-700"
        >
          Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          value={formData.phone}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, phone: e.target.value }))
          }
          className={`mt-1 block w-full rounded-md border ${
            formErrors.phone ? "border-red-500" : "border-gray-300"
          } px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary`}
          pattern="[0-9]{10,}"
          title="Please enter at least 10 digits"
        />
        {formErrors.phone && (
          <p className="mt-1 text-sm text-red-500">{formErrors.phone}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="cuisine"
          className="block text-sm font-medium text-gray-700"
        >
          Cuisine Type *
        </label>
        <input
          type="text"
          id="cuisine"
          value={formData.cuisine}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, cuisine: e.target.value }))
          }
          className={`mt-1 block w-full rounded-md border ${
            formErrors.cuisine ? "border-red-500" : "border-gray-300"
          } px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary`}
          required
          maxLength={50}
        />
        {formErrors.cuisine && (
          <p className="mt-1 text-sm text-red-500">{formErrors.cuisine}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="imageUrl"
          className="block text-sm font-medium text-gray-700"
        >
          Image URL
        </label>
        <input
          type="url"
          id="imageUrl"
          value={formData.imageUrl}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, imageUrl: e.target.value }))
          }
          className={`mt-1 block w-full rounded-md border ${
            formErrors.imageUrl ? "border-red-500" : "border-gray-300"
          } px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary`}
          pattern="https?://.+"
          title="Please enter a valid URL starting with http:// or https://"
        />
        {formErrors.imageUrl && (
          <p className="mt-1 text-sm text-red-500">{formErrors.imageUrl}</p>
        )}
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <Button
          type="button"
          onClick={onCancel}
          variant="outline"
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : initialData ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
}
