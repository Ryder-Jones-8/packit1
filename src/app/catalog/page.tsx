"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CatalogPage() {
  const router = useRouter();
  
  // Redirect to the clothing page
  useEffect(() => {
    router.replace('/clothing');
  }, [router]);
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600">Redirecting to clothing catalog...</p>
      </div>
    </div>
  );
  const handleDeleteItem = (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      deleteClothingItem(id);
      setClothingItems(clothingItems.filter(item => item.id !== id));
    }
  };
  
  const categories = getAllCategories();

  return (
    <>
      <Navbar activePage="catalog" />
      <main className="container mx-auto px-4 py-8">
        <PageHeader 
          title="Clothing Catalog" 
          description="Manage your wardrobe by adding, editing, and organizing your clothing items"
        >          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 flex items-center font-poppins font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Item
          </button>
        </PageHeader>

        {/* Search and filter */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative md:w-64">            <input
              type="text"
              placeholder="Search clothing..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-inter"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-3 top-2.5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1 rounded-full text-sm ${
                activeCategory === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All Items
            </button>
            
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-3 py-1 rounded-full text-sm ${
                  activeCategory === category
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Clothing items grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>            <h3 className="text-xl font-medium mb-2">No clothing items found</h3>
            <p className="text-gray-900 mb-6">
              {searchQuery || activeCategory !== 'all' ? 'Try changing your search or filters' : 'Start building your catalog by adding some clothing items'}
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 inline-flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add First Item
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <ClothingCard
                key={item.id}
                item={item}
                onDelete={() => handleDeleteItem(item.id)}
              />
            ))}
          </div>
        )}

        {/* Add modal would be here in a real implementation */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">              <h2 className="text-xl font-semibold mb-4 font-montserrat">Add Clothing Item</h2>
              <p className="text-gray-900 mb-4 font-inter">This is a placeholder for the add clothing item modal.</p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button                  onClick={() => {
                    // This is a placeholder. In a real implementation, we would collect form data
                    const mockItem = {
                      name: 'Sample ' + Math.floor(Math.random() * 1000),
                      category: 'shirts' as ClothingCategory,
                      seasons: ['summer', 'spring'] as Season[],
                      weatherConditions: ['hot', 'warm'],
                      color: 'blue',
                      description: 'A sample clothing item'
                    };
                    handleAddItem(mockItem);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save (Demo)
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

interface ClothingCardProps {
  item: ClothingItem;
  onDelete: () => void;
}

function ClothingCard({ item, onDelete }: ClothingCardProps) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-48 bg-gray-200 flex items-center justify-center">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
        ) : (
          <div className="text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
            </svg>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-lg mb-1">{item.name}</h3>
            <p className="text-gray-900 text-sm">{item.category.charAt(0).toUpperCase() + item.category.slice(1)}</p>
          </div>
          <div className="h-6 w-6 rounded-full" style={{ backgroundColor: item.color }} />
        </div>
        
        {item.description && (
          <p className="text-gray-700 text-sm mt-2">{item.description}</p>
        )}
        
        <div className="mt-3 flex flex-wrap gap-1">
          {item.seasons.map(season => (
            <span key={season} className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded text-xs">
              {season.charAt(0).toUpperCase() + season.slice(1)}
            </span>
          ))}
        </div>
        
        <div className="mt-4 flex justify-between">
          <button
            className="text-blue-600 hover:text-blue-800"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="text-red-600 hover:text-red-800"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}