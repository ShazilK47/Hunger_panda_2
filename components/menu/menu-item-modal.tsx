"use client";

import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { formatCurrency } from "@/lib/utils/format";
import { MenuItem } from "@/lib/types/menu";
import { useCart } from "@/components/cart/cart-context";

interface MenuItemModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  closeModal: () => void;
}

export default function MenuItemModal({
  item,
  isOpen,
  closeModal,
}: MenuItemModalProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart, isInCart } = useCart();

  // Handle quantity changes
  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));

  // Handle add to cart
  const handleAddToCart = () => {
    if (!item) return;
    addToCart(item, quantity);
    // Reset quantity and close modal
    setQuantity(1);
    closeModal();
  };

  if (!item) return null;

  const inCart = isInCart(item.id);

  // Default image if none provided
  const displayImage =
    item.imageUrl ||
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3";

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-60" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-start">
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-semibold leading-6 text-gray-900 font-serif"
                  >
                    {item.name}
                  </Dialog.Title>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500"
                    onClick={closeModal}
                  >
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="mt-4 relative">
                  <div className="relative h-56 w-full overflow-hidden rounded-lg">
                    <Image
                      src={displayImage}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 400px"
                    />
                  </div>
                  <div className="absolute top-2 right-2 bg-primary text-black px-3 py-1 rounded-full text-sm font-medium">
                    {item.category}
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-gray-600">
                    {item.description || "No description available."}
                  </p>

                  <div className="mt-6 flex items-center justify-between">
                    <div className="text-xl font-semibold text-primary">
                      {formatCurrency(item.price)}
                    </div>{" "}
                    <div className="flex items-center border border-gray-300 rounded-full overflow-hidden shadow-sm">
                      <button
                        onClick={decrementQuantity}
                        className="w-9 h-9 flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-all"
                        aria-label="Decrease quantity"
                      >
                        <span className="transform translate-y-[-1px] text-lg font-bold">
                          −
                        </span>
                      </button>
                      <span className="w-9 h-9 flex items-center justify-center font-medium text-gray-900">
                        {quantity}
                      </span>
                      <button
                        onClick={incrementQuantity}
                        className="w-9 h-9 flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-all"
                        aria-label="Increase quantity"
                      >
                        <span className="transform translate-y-[-1px] text-lg font-bold">
                          +
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    className="w-full flex items-center justify-center px-4 py-3 bg-primary text-black rounded-full hover:bg-primary/90 transition-colors disabled:bg-gray-400"
                    onClick={handleAddToCart}
                    disabled={inCart}
                  >
                    {inCart
                      ? "Item in Cart"
                      : `Add to Cart - ${formatCurrency(
                          item.price * quantity
                        )}`}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
