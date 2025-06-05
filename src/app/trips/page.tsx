"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import AddTripForm from "@/components/AddTripForm";
import EditTripForm from "@/components/EditTripForm";
import { Trip } from "@/lib/types/trip";
import { getAllTrips, createTrip, deleteTrip, getTripById, updateTrip } from "@/lib/services/tripService";
import { formatDate } from "@/lib/utils/helpers";

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentTripId, setCurrentTripId] = useState<string | null>(null);

  // Load trips
  useEffect(() => {
    const loadedTrips = getAllTrips();
    setTrips(loadedTrips);
  }, []);

  // Create a new trip
  const handleCreateTrip = async (destination: string, startDate: Date, endDate: Date, notes?: string) => {
    try {
      const newTrip = await createTrip(destination, startDate, endDate, notes);
      setTrips([...trips, newTrip]);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Error creating trip:", error);
      alert("Failed to create trip. Please try again.");
    }
  };

  // Update an existing trip
  const handleUpdateTrip = async (id: string, updates: {
    destination: string;
    startDate: Date;
    endDate: Date;
    notes?: string;
  }) => {
    try {
      const updatedTrip = updateTrip(id, updates);
      if (updatedTrip) {
        setTrips(trips.map(trip => trip.id === id ? updatedTrip : trip));
        setIsEditModalOpen(false);
        setCurrentTripId(null);
      }
    } catch (error) {
      console.error("Error updating trip:", error);
      alert("Failed to update trip. Please try again.");
    }
  };

  // Delete a trip
  const handleDeleteTrip = (id: string) => {
    if (window.confirm("Are you sure you want to delete this trip?")) {
      const success = deleteTrip(id);
      if (success) {
        setTrips(trips.filter(trip => trip.id !== id));
      }
    }
  };
  
  // Open edit modal
  const handleEditTrip = (id: string) => {
    setCurrentTripId(id);
    setIsEditModalOpen(true);
  };

  return (
    <>
      <Navbar activePage="trips" />
      <main className="container mx-auto px-4 py-8">
        <PageHeader 
          title="My Trips" 
          description="Plan and organize your trips with smart packing recommendations"
        >          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 flex items-center font-poppins font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            New Trip
          </button>
        </PageHeader>

        {/* Trips grid */}
        {trips.length === 0 ? (
          <div className="text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M6.115 5.19 1.5 9.5m0 0 4.615 4.31m-4.615-4.31 3.027 8.375a1.5 1.5 0 0 1-1.302 2.125h-.414a1.5 1.5 0 0 1-1.302-2.125l3.027-8.375Zm13.654 8.31L22.5 14.5m0 0-4.615 4.31m4.615-4.31-3.027-8.375a1.5 1.5 0 0 1 1.302-2.125h.414a1.5 1.5 0 0 1 1.302 2.125l-3.027 8.375Z" />
            </svg>            <h3 className="text-xl font-medium mb-2 font-montserrat">No trips planned yet</h3>
            <p className="text-gray-900 mb-6 font-inter">Start planning your next adventure</p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 inline-flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Create First Trip
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">            {trips.map((trip) => (
              <TripCard 
                key={trip.id} 
                trip={trip} 
                onDelete={() => handleDeleteTrip(trip.id)}
                onEdit={handleEditTrip}
              />
            ))}
          </div>        )}
        
        {/* Create Trip Modal */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Plan a New Trip</h2>
              <AddTripForm 
                onSubmit={handleCreateTrip}
                onCancel={() => setIsCreateModalOpen(false)}
              />
            </div>
          </div>
        )}

        {/* Edit Trip Modal */}
        {isEditModalOpen && currentTripId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Edit Trip</h2>
              {trips.find(trip => trip.id === currentTripId) && (
                <EditTripForm 
                  trip={trips.find(trip => trip.id === currentTripId)!}
                  onSubmit={handleUpdateTrip}
                  onCancel={() => {
                    setIsEditModalOpen(false);
                    setCurrentTripId(null);
                  }}
                />
              )}
            </div>
          </div>
        )}
      </main>
    </>
  );
}

interface TripCardProps {
  trip: Trip;
  onDelete: () => void;
  onEdit: (id: string) => void;
}

function TripCard({ trip, onDelete, onEdit }: TripCardProps) {
  // Count total items packed
  const totalItemsPacked = trip.bags.reduce((total, bag) => total + bag.items.length, 0);
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-48 bg-blue-500 flex items-center justify-center text-white">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/50 via-blue-500/30 to-blue-400/20"></div>
        <div className="relative z-10 text-center p-4">
          <h3 className="text-2xl font-bold mb-2">{trip.destination}</h3>
          <p className="text-white/80">
            {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
          </p>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <span className="text-sm text-gray-800">Weather</span>
            <div className="flex items-center">
              {trip.weatherForecast && trip.weatherForecast.length > 0 ? (
                <>
                  <span className="font-medium">{trip.weatherForecast[0].minTemp}° - {trip.weatherForecast[0].maxTemp}°</span>
                  <span className="ml-2 text-gray-800">{trip.weatherForecast[0].condition}</span>
                </>
              ) : (
                <span className="text-gray-500">No forecast available</span>
              )}
            </div>
          </div>
          <div>            <span className="text-sm text-gray-900">Items Packed</span>
            <p className="font-medium text-center">{totalItemsPacked}</p>
          </div>
        </div>
        
        <div className="border-t border-gray-100 pt-4 mt-2">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Bags</h4>
          <div className="grid grid-cols-3 gap-2">
            {trip.bags.map((bag) => (
              <div key={bag.id} className="bg-gray-50 p-2 rounded-md">
                <p className="text-sm font-medium">{bag.name}</p>
                <p className="text-xs text-gray-500">{bag.items.length} / {bag.capacity} items</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-between mt-6">
          <a href={`/packing?trip=${trip.id}`} className="text-blue-600 hover:text-blue-800 font-medium">
            Pack Bags
          </a>          <div className="flex space-x-4">
            <button 
              onClick={() => onEdit(trip.id)} 
              className="text-blue-600 hover:text-blue-800">
              Edit
            </button>
            <button onClick={onDelete} className="text-red-600 hover:text-red-800">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}