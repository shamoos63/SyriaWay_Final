"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Search, Hotel, Car, Compass, Percent, MapPin, Star, Clock, X, Calendar, Users, Phone, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/i18n/language-context"
import Link from "next/link"

interface SearchResult {
  id: string
  name: string
  description: string
  type: string
  price: number
  rating: number
  location: string
  image: string
  url: string
  provider?: string
  details?: string[]
  originalPrice?: number
  discount?: string
}

export function SearchBar() {
  const { t, dir } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null)
  const [showModal, setShowModal] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    setLoading(true)
    setError("")
    setShowDropdown(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&limit=10`)
      if (!res.ok) throw new Error("Failed to search")
      const data = await res.json()
      setResults(data.results)
      setShowDropdown(true)
    } catch (err) {
      setError("Failed to search. Please try again.")
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setError("")
    if (!e.target.value) {
      setResults([])
      setShowDropdown(false)
    }
  }

  const handleBlur = () => {
    setTimeout(() => setShowDropdown(false), 200)
  }

  const handleResultClick = (result: SearchResult) => {
    setSelectedResult(result)
    setShowModal(true)
    setShowDropdown(false)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedResult(null)
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "hotel": return <Hotel className="h-5 w-5 text-syria-gold" />
      case "car": return <Car className="h-5 w-5 text-syria-gold" />
      case "tour": return <Compass className="h-5 w-5 text-syria-gold" />
      case "offer": return <Percent className="h-5 w-5 text-syria-gold" />
      default: return <Search className="h-5 w-5 text-syria-gold" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "hotel": return "Hotel"
      case "car": return "Car Rental"
      case "tour": return "Tour"
      case "offer": return "Special Offer"
      default: return "Service"
    }
  }

  const searchButtonText = t?.search?.searchButton || t?.search?.search || "Search"
  const placeholderText = t?.search?.placeholder || "Search for hotels, cars, tours, or special offers..."

  return (
    <div className="w-full max-w-4xl mx-auto relative">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative flex items-center">
          <div className="relative flex-1">
            <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl border border-syria-gold/20 shadow-lg"></div>
            <div className="relative flex items-center">
              <Search className="absolute left-4 h-5 w-5 text-syria-gold z-10" />
              <input
                ref={inputRef}
                type="text"
                placeholder={placeholderText}
                value={searchQuery}
                onChange={handleInputChange}
                onFocus={() => searchQuery && setShowDropdown(true)}
                onBlur={handleBlur}
                className="w-full pl-12 pr-4 py-4 bg-transparent border-none focus:outline-none focus:ring-0 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 text-lg font-medium rounded-2xl"
                autoComplete="off"
              />
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="ml-3 bg-gradient-to-r from-syria-teal to-blue-600 hover:from-syria-dark-teal hover:to-blue-700 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105"
          >
            {searchButtonText}
          </Button>
        </div>

        {showDropdown && (results.length > 0 || loading || error) && (
          <div className="absolute left-0 right-0 mt-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl z-[9999] max-h-96 overflow-y-auto border border-syria-gold/20">
            {loading && (
              <div className="p-6 text-center">
                <div className="inline-flex items-center gap-3 text-syria-gold">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-syria-gold"></div>
                  <span className="font-medium">Searching...</span>
                </div>
              </div>
            )}

            {error && (
              <div className="p-6 text-center">
                <div className="text-red-500 font-medium">{error}</div>
              </div>
            )}

            {!loading && !error && results.length === 0 && (
              <div className="p-6 text-center">
                <div className="text-gray-500 font-medium">No results found</div>
                <div className="text-sm text-gray-400 mt-1">Try different keywords</div>
              </div>
            )}

            {!loading && !error && results.map((item, idx) => (
              <button
                key={item.id + idx}
                onClick={() => handleResultClick(item)}
                className="w-full text-left group"
              >
                <div className="flex items-center gap-4 p-4 hover:bg-syria-gold/5 transition-all duration-200 border-b last:border-b-0 border-syria-gold/10 group-hover:border-syria-gold/30">
                  <div className="relative">
                    <div className="p-3 bg-syria-gold/10 rounded-xl group-hover:bg-syria-gold/20 transition-colors">
                      {getIcon(item.type)}
                    </div>
                    <div className="absolute -top-1 -right-1 bg-syria-gold text-white text-xs px-2 py-1 rounded-full font-medium">
                      {getTypeLabel(item.type)}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-syria-gold transition-colors truncate">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                          {item.description}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate">{item.location}</span>
                          </div>
                          {item.rating > 0 && (
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-yellow-400 fill-current" />
                              <span>{item.rating}</span>
                            </div>
                          )}
                          {item.details && item.details[0] && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{item.details[0]}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {item.price && (
                        <div className="text-right">
                          <div className="font-bold text-syria-gold text-lg">
                            ${item.price}
                          </div>
                          {item.originalPrice && item.originalPrice > item.price && (
                            <div className="text-xs text-gray-400 line-through">
                              ${item.originalPrice}
                            </div>
                          )}
                          {item.discount && (
                            <div className="text-xs bg-red-500 text-white px-2 py-1 rounded-full font-bold mt-1">
                              {item.discount}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}

            {!loading && !error && results.length > 0 && (
              <div className="p-4 bg-syria-gold/5 border-t border-syria-gold/10 rounded-b-2xl">
                <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  Found {results.length} result{results.length !== 1 ? 's' : ''} for "{searchQuery}"
                </div>
              </div>
            )}
          </div>
        )}
      </form>

      {showModal && selectedResult && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-syria-gold/10 rounded-lg">
                  {getIcon(selectedResult.type)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {selectedResult.name}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {getTypeLabel(selectedResult.type)}
                  </p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              <div className="relative h-48 bg-gray-200 dark:bg-gray-700 rounded-xl mb-6 overflow-hidden">
                <img
                  src={selectedResult.image}
                  alt={selectedResult.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg'
                  }}
                />
                {selectedResult.discount && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full font-bold text-sm">
                    {selectedResult.discount}
                  </div>
                )}
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Description
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {selectedResult.description || "No description available."}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <MapPin className="h-4 w-4 text-syria-gold" />
                  <span>{selectedResult.location}</span>
                </div>
                
                {selectedResult.rating > 0 && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span>{selectedResult.rating} Rating</span>
                  </div>
                )}

                {selectedResult.provider && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <Users className="h-4 w-4 text-syria-gold" />
                    <span>Provider: {selectedResult.provider}</span>
                  </div>
                )}

                {selectedResult.details && selectedResult.details.length > 0 && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <Clock className="h-4 w-4 text-syria-gold" />
                    <span>{selectedResult.details.join(', ')}</span>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Price</h4>
                    {selectedResult.originalPrice && selectedResult.originalPrice > selectedResult.price && (
                      <p className="text-sm text-gray-500 line-through">
                        ${selectedResult.originalPrice}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-syria-gold">
                      ${selectedResult.price}
                    </div>
                    <p className="text-sm text-gray-500">
                      {selectedResult.type === 'hotel' ? 'per night' : 
                       selectedResult.type === 'car' ? 'per day' : 
                       selectedResult.type === 'tour' ? 'per person' : 'total'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Link
                  href={selectedResult.url}
                  className="flex-1 bg-syria-teal hover:bg-syria-dark-teal text-white font-semibold py-3 px-6 rounded-xl transition-colors text-center"
                >
                  Book Now
                </Link>
                <button
                  onClick={closeModal}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
