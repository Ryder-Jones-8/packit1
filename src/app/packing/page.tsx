"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import TripDetails from "@/components/TripDetails";
import { Trip } from "@/lib/types/trip";
import { getTripById, getAllTrips } from "@/lib/services/tripService";
import { formatDate } from "@/lib/utils/helpers";

export default function PackingPage() {
  const searchParams = useSearchParams();
  const tripId = searchParams.get("trip");
  
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // Load trip data
  useEffect(() => {
    // If no trip ID is provided, check if we have any trips available
    if (!tripId) {
      const allTrips = getAllTrips();
      if (allTrips.length > 0) {
        // Redirect to the first trip
        window.location.href = `/packing?trip=${allTrips[0].id}`;
        return;
      } else {
        setError("No trips available. Please create a trip first.");
      }
    } else {
      const loadedTrip = getTripById(tripId);
      if (loadedTrip) {
        setTrip(loadedTrip);
      } else {
        setError("Trip not found. Please check the URL or return to trips page.");
      }
    }
    setLoading(false);
  }, [tripId]);

  // Update trip when changes are made
  const handleTripUpdate = (updatedTrip: Trip) => {
    setTrip(updatedTrip);
  };

  return (
    <>
      <Navbar activePage="trips" />
      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-800 p-6 rounded-lg flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <h2 className="text-xl font-medium text-red-700 mb-2">Something went wrong</h2>
            <p className="text-center mb-6">{error}</p>
            <a href="/trips" className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700">
              Return to Trips Page
            </a>
          </div>
        ) : trip ? (
          <>
            <PageHeader 
              title={`Packing for ${trip.destination}`} 
              description={`${formatDate(trip.startDate)} - ${formatDate(trip.endDate)}`}
            >
              <a 
                href="/trips" 
                className="text-blue-600 hover:text-blue-800 flex items-center font-poppins font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to Trips
              </a>
            </PageHeader>
            
            <TripDetails trip={trip} onTripUpdate={handleTripUpdate} />
          </>
        ) : null}
      </main>
    </>
  );
}