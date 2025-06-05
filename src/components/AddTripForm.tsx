"use client";

import { useState } from 'react';
import { Trip } from '@/lib/types/trip';

interface AddTripFormProps {
  onSubmit: (destination: string, startDate: Date, endDate: Date, notes?: string) => Promise<void>;
  onCancel: () => void;
}

export default function AddTripForm({ onSubmit, onCancel }: AddTripFormProps) {
  const [destination, setDestination] = useState<string>('');
  const [startDate, setStartDate] = useState<string>(getTomorrowDate());
  const [endDate, setEndDate] = useState<string>(getDateAfterDays(7)); // Default to a week trip
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<{
    destination?: string;
    startDate?: string;
    endDate?: string;
  }>({});

  function getTomorrowDate() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }

  function getDateAfterDays(days: number) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  }

  const validateForm = () => {
    const newErrors: {
      destination?: string;
      startDate?: string;
      endDate?: string;
    } = {};

    if (!destination.trim()) {
      newErrors.destination = 'Destination is required';
    }

    if (!startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!endDate) {
      newErrors.endDate = 'End date is required';
    } else if (new Date(endDate) < new Date(startDate)) {
      newErrors.endDate = 'End date must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(
        destination,
        new Date(startDate),
        new Date(endDate),
        notes || undefined
      );
    } catch (error) {
      console.error('Error submitting trip:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="destination" className="block text-sm font-medium text-gray-900 mb-1">
          Destination
        </label>
        <input
          type="text"
          id="destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="e.g., New York City, London, Tokyo"
        />
        {errors.destination && (
          <p className="text-red-500 text-sm mt-1">{errors.destination}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-900 mb-1">
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.startDate && (
            <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
          )}
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-900 mb-1">
            End Date
          </label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            min={startDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.endDate && (
            <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-900 mb-1">
          Notes (Optional)
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Add any notes about your trip..."
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 text-gray-800"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating...
            </>
          ) : (
            'Create Trip'
          )}
        </button>
      </div>
    </form>
  );
}
