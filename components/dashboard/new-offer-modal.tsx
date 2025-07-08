"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"

interface NewOfferModalProps {
  isOpen: boolean
  onClose: () => void
}

export function NewOfferModal({ isOpen, onClose }: NewOfferModalProps) {
  const [title, setTitle] = useState("")
  const [details, setDetails] = useState("")
  const [photos, setPhotos] = useState<File[]>([])
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleAddPhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos(Array.from(e.target.files))
    }
  }

  const handleDraft = () => {
    // Save as draft logic
    console.log("Saving as draft:", { title, details, photos })
    onClose()
  }

  const handlePublish = () => {
    // Publish logic
    console.log("Publishing:", { title, details, photos })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        ref={modalRef}
        className="relative w-full max-w-3xl bg-syria-gold dark:bg-gold-accent rounded-lg overflow-hidden"
      >
        <div className="p-6">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/80 hover:text-white">
            <X size={24} />
          </button>

          <h2 className="text-3xl font-bold text-white text-center mb-6">New Offer</h2>

          <div className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-syria-cream dark:bg-gray-100 text-gray-900 border-none"
              />
            </div>

            <div>
              <Textarea
                placeholder="Details"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="w-full min-h-[200px] bg-syria-cream dark:bg-gray-100 text-gray-900 border-none"
              />
            </div>

            {photos.length > 0 && (
              <div className="mt-4">
                <h3 className="text-white mb-2">Selected Photos:</h3>
                <div className="flex flex-wrap gap-2">
                  {photos.map((photo, index) => (
                    <div
                      key={index}
                      className="relative w-20 h-20 bg-syria-cream dark:bg-gray-100 rounded-md overflow-hidden"
                    >
                      <img
                        src={URL.createObjectURL(photo) || "/placeholder.svg"}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => setPhotos(photos.filter((_, i) => i !== index))}
                        className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-bl-md"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between pt-4">
              <div className="relative">
                <input
                  type="file"
                  id="photo-upload"
                  multiple
                  accept="image/*"
                  onChange={handleAddPhotos}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Button type="button" className="bg-syria-cream hover:bg-syria-cream/90 text-gray-900">
                  Add Photos
                </Button>
              </div>

              <div className="space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDraft}
                  className="bg-syria-cream hover:bg-syria-cream/90 text-gray-900 border-none"
                >
                  Draft
                </Button>

                <Button
                  type="button"
                  onClick={handlePublish}
                  className="bg-syria-cream hover:bg-syria-cream/90 text-gray-900"
                >
                  Publish
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
