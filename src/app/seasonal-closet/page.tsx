"use client";

import { useEffect, useState } from "react";
import { ClothingItem } from "@/lib/types/clothing";
import { ClosetView } from "@/components/ui/ClosetView";
import PageHeader from "@/components/PageHeader";
import { getAllClothingItems } from "@/lib/services/clothingService";

export default function SeasonalClosetPage() {
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {    const loadItems = async () => {
      try {
        setLoading(true);
        const items = await getAllClothingItems();
        setClothingItems(items);
      } catch (error) {
        console.error("Failed to load clothing items:", error);
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, []);
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader 
        title="Seasonal Closet" 
        description="Organize your clothing by season"
      />

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : clothingItems.length > 0 ? (
        <ClosetView items={clothingItems} />
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-medium text-gray-600 mb-4">Your closet is empty</h3>
          <p className="text-gray-500 mb-6">Add some clothing items to organize them by season</p>
          <a 
            href="/clothing" 
            className="inline-block px-5 py-3 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition-colors"
          >
            Add Clothing Items
          </a>
        </div>
      )}
    </div>
  );
}