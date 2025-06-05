"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { initializeAppData } from "@/lib/services/seedData";
import { getAllTrips } from "@/lib/services/tripService";

export default function Home() {
  const [hasInitialized, setHasInitialized] = useState(false);
  const [tripsCount, setTripsCount] = useState(0);
  
  useEffect(() => {
    // Initialize sample data
    initializeAppData();
    
    // Check if there are any trips
    const trips = getAllTrips();
    setTripsCount(trips.length);
    
    setHasInitialized(true);
  }, []);

  if (!hasInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mb-4"></div>
        <h1 className="text-3xl font-bold text-primary mb-2 font-orbitron">PackIt</h1>
        <p className="text-foreground-muted">Initializing your wardrobe...</p>
      </div>
    );  }

  return (
    <>
      <Navbar activePage="home" />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-end mb-4">
          <ThemeToggle />
        </div>
        <div className="text-center mb-12 bg-background-card p-10 rounded-lg shadow-md">
          <h1 className="text-5xl font-bold mb-4 text-foreground tracking-wider font-orbitron">
            <span className="inline-block text-transparent" style={{ 
              backgroundImage: "linear-gradient(to right, var(--primary), var(--accent))", 
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              transition: "transform 0.3s ease",
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              Pack
            </span>
            <span className="inline-block text-foreground">It</span>
          </h1>
          <p className="text-xl text-foreground-muted mb-8 font-montserrat">Your virtual closet and smart packing assistant</p>
          <div className="flex flex-col md:flex-row justify-center items-center gap-8">
            <div className="bg-background p-8 rounded-lg shadow-md w-full md:w-1/3 hover:shadow-lg transition-shadow flex flex-col h-full">
              <div className="flex items-center justify-center h-32 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-20 h-20 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold mb-2 text-foreground font-montserrat">My Closet</h2>
              <p className="text-foreground mb-4 font-inter">Manage your wardrobe by categorizing all your clothing items</p>
              <div className="mt-auto">
                <Link href="/clothing" className="block w-full bg-primary text-primary-foreground py-2 px-4 rounded hover:bg-primary-hover text-center transition-colors font-poppins font-medium">
                  View Closet
                </Link>
              </div>
            </div>            
            <div className="bg-background p-8 rounded-lg shadow-md w-full md:w-1/3 hover:shadow-lg transition-shadow flex flex-col h-full">
              <div className="flex items-center justify-center h-32 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-20 h-20 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold mb-2 text-foreground font-montserrat">Trip Planning</h2>
              <p className="text-foreground mb-4 font-inter">
                {tripsCount === 0
                  ? "Create your first trip and get packing recommendations"
                  : `You have ${tripsCount} trip${tripsCount === 1 ? '' : 's'} planned`
                }
              </p>
              <div className="mt-auto">
                <Link href="/trips" className="block w-full bg-primary text-primary-foreground py-2 px-4 rounded hover:bg-primary-hover text-center transition-colors font-poppins font-medium">
                  My Trips
                </Link>
              </div>
            </div>            
            <div className="bg-background p-8 rounded-lg shadow-md w-full md:w-1/3 hover:shadow-lg transition-shadow flex flex-col h-full">
              <div className="flex items-center justify-center h-32 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-20 h-20 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold mb-2 text-foreground font-montserrat">Packing Lists</h2>
              <p className="text-foreground mb-4 font-inter">Pack your bags virtually and never forget essentials again</p>
              <div className="mt-auto">
                <Link 
                  href={tripsCount > 0 ? `/packing?trip=${getAllTrips()[0].id}` : "/trips"} 
                  className="block w-full bg-primary text-primary-foreground py-2 px-4 rounded hover:bg-primary-hover text-center transition-colors font-poppins font-medium"
                >
                  {tripsCount > 0 ? "Start Packing" : "Create Trip First"}
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 bg-background-card p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-6 text-foreground font-montserrat text-center">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center">
              <div className="bg-secondary rounded-full p-4 mb-4">
                <span className="text-primary text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-medium mb-2 text-foreground font-montserrat text-center">Add your clothing</h3>
              <p className="text-center text-foreground font-inter">Catalog your wardrobe with categories, colors, and seasons</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-secondary rounded-full p-4 mb-4">
                <span className="text-primary text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-medium mb-2 text-foreground font-montserrat text-center">Plan your trip</h3>
              <p className="text-center text-foreground font-inter">Enter your destination and travel dates</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-secondary rounded-full p-4 mb-4">
                <span className="text-primary text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-medium mb-2 text-foreground font-montserrat text-center">Pack with confidence</h3>
              <p className="text-center text-foreground font-inter">Get smart recommendations based on weather and trip duration</p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}