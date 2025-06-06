"use client";

import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import ClothingManager from "@/components/ClothingManager";

export default function Page() {
  return (
    <>
      <Navbar activePage="clothing" />
      <main className="container mx-auto px-4 py-8">
        <PageHeader 
          title="My Closet" 
          description="Manage your wardrobe for smart packing recommendations"
        />
        <ClothingManager />
      </main>
    </>
  );
}