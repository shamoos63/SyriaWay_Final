"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/i18n/language-context"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { Plus, Edit, Trash2, Clock, Users, DollarSign } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface UmrahPackage {
  id: string
  name: string
  description: string | null
  duration: number
  groupSize: string
  season: string | null
  price: number
  currency: string
  includes: string[] | null
  images: string[] | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function UmrahPackagesPage() {
  const { t, language, dir } = useLanguage()
  const { user } = useAuth()
  const [packages, setPackages] = useState<UmrahPackage[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingPackage, setEditingPackage] = useState<UmrahPackage | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    duration: "",
    groupSize: "",
    season: "",
    price: "",
    currency: "USD",
    includes: [] as string[],
    images: [] as string[],
    isActive: true
  })

  useEffect(() => {
    fetchPackages()
  }, [])

  const fetchPackages = async () => {
    setLoading(true)
    try {
      console.log('Fetching packages with user ID:', user?.id)
      const res = await fetch('/api/admin/umrah/packages', {
        headers: {
          'Authorization': `Bearer ${user?.id}`
        }
      })
      console.log('Response status:', res.status)
      if (!res.ok) {
        const errorData = await res.json()
        console.error('API Error:', errorData)
        throw new Error('Failed to fetch packages')
      }
      const data = await res.json()
      setPackages(data.packages)
    } catch (error) {
      console.error('Error fetching packages:', error)
      toast({
        title: "Error",
        description: "Failed to load Umrah packages",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingPackage(null)
    setFormData({
      name: "",
      description: "",
      duration: "",
      groupSize: "",
      season: "",
      price: "",
      currency: "USD",
      includes: [],
      images: [],
      isActive: true
    })
    setShowModal(true)
  }

  const handleEdit = (pkg: UmrahPackage) => {
    setEditingPackage(pkg)
    setFormData({
      name: pkg.name,
      description: pkg.description || "",
      duration: pkg.duration.toString(),
      groupSize: pkg.groupSize,
      season: pkg.season || "",
      price: pkg.price.toString(),
      currency: pkg.currency,
      includes: pkg.includes || [],
      images: pkg.images || [],
      isActive: pkg.isActive
    })
    setShowModal(true)
  }

  const handleSubmit = async () => {
    if (!formData.name || !formData.duration || !formData.groupSize || !formData.price) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    setSubmitting(true)
    try {
      const url = editingPackage 
        ? `/api/admin/umrah/packages/${editingPackage.id}`
        : '/api/admin/umrah/packages'
      
      const method = editingPackage ? 'PUT' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.id}`
        },
        body: JSON.stringify({
          ...formData,
          duration: parseInt(formData.duration),
          price: parseFloat(formData.price)
        })
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to save package')
      }

      toast({
        title: "Success",
        description: editingPackage ? "Package updated successfully" : "Package created successfully",
        variant: "default"
      })

      setShowModal(false)
      fetchPackages()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save package",
        variant: "destructive"
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this package?")) return

    try {
      const res = await fetch(`/api/admin/umrah/packages/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user?.id}`
        }
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to delete package')
      }

      toast({
        title: "Success",
        description: "Package deleted successfully",
        variant: "default"
      })

      fetchPackages()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete package",
        variant: "destructive"
      })
    }
  }

  const addIncludeItem = () => {
    setFormData(prev => ({
      ...prev,
      includes: [...prev.includes, ""]
    }))
  }

  const updateIncludeItem = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      includes: prev.includes.map((item, i) => i === index ? value : item)
    }))
  }

  const removeIncludeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      includes: prev.includes.filter((_, i) => i !== index)
    }))
  }

  const addImageUrl = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ""]
    }))
  }

  const updateImageUrl = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((item, i) => i === index ? value : item)
    }))
  }

  const removeImageUrl = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  return (
    <div className="space-y-6" dir={dir}>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">
            {language === "ar" ? "إدارة باقات العمرة" : language === "fr" ? "Gestion des Forfaits Omra" : "Umrah Packages Management"}
          </h1>
          <p className="text-muted-foreground">
            {language === "ar" 
              ? "إدارة باقات العمرة المتاحة للعملاء" 
              : language === "fr" 
                ? "Gérer les forfaits Omra disponibles pour les clients"
                : "Manage available Umrah packages for customers"}
          </p>
        </div>
        <Button onClick={handleCreate} className="bg-syria-gold hover:bg-syria-dark-gold">
          <Plus className="mr-2 h-4 w-4" />
          {language === "ar" ? "إضافة باقة جديدة" : language === "fr" ? "Ajouter un Forfait" : "Add New Package"}
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-syria-gold"></div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => (
            <Card key={pkg.id} className="overflow-hidden">
              <div className="relative h-48 w-full">
                <img 
                  src={pkg.images && pkg.images.length > 0 ? pkg.images[0] : "/the-kaaba.png"} 
                  alt={pkg.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/the-kaaba.png"
                  }}
                />
                <div className="absolute top-2 right-2">
                  <Badge variant={pkg.isActive ? "default" : "secondary"}>
                    {pkg.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{pkg.name}</CardTitle>
                <CardDescription className="line-clamp-2">{pkg.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-syria-gold" />
                    <span>{pkg.duration} days</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-syria-gold" />
                    <span>{pkg.groupSize}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-syria-gold" />
                    <span>${pkg.price} {pkg.currency}</span>
                  </div>
                  {pkg.season && (
                    <Badge variant="outline">{pkg.season}</Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleEdit(pkg)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleDelete(pkg.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPackage 
                ? (language === "ar" ? "تعديل الباقة" : language === "fr" ? "Modifier le Forfait" : "Edit Package")
                : (language === "ar" ? "إضافة باقة جديدة" : language === "fr" ? "Ajouter un Forfait" : "Add New Package")
              }
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Package name"
                />
              </div>
              <div>
                <Label htmlFor="duration">Duration (days) *</Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                  placeholder="10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="groupSize">Group Size *</Label>
                <Select value={formData.groupSize} onValueChange={(value) => setFormData(prev => ({ ...prev, groupSize: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select group size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Individual">Individual</SelectItem>
                    <SelectItem value="Family">Family</SelectItem>
                    <SelectItem value="Group">Group</SelectItem>
                    <SelectItem value="Up to 10 people">Up to 10 people</SelectItem>
                    <SelectItem value="Up to 20 people">Up to 20 people</SelectItem>
                    <SelectItem value="Up to 50 people">Up to 50 people</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="season">Season</Label>
                <Select value={formData.season} onValueChange={(value) => setFormData(prev => ({ ...prev, season: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select season" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Regular">Regular</SelectItem>
                    <SelectItem value="Ramadan">Ramadan</SelectItem>
                    <SelectItem value="Hajj">Hajj</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="1200.00"
                />
              </div>
              <div>
                <Label htmlFor="currency">Currency</Label>
                <Select value={formData.currency} onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="SAR">SAR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Package description..."
                rows={3}
              />
            </div>

            {/* What's Included */}
            <div>
              <Label>What's Included</Label>
              <div className="space-y-2">
                {formData.includes.map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={item}
                      onChange={(e) => updateIncludeItem(index, e.target.value)}
                      placeholder="e.g., Visa, Accommodation, Transport"
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => removeIncludeItem(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addIncludeItem}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Item
                </Button>
              </div>
            </div>

            {/* Image URLs */}
            <div>
              <Label>Image URLs</Label>
              <div className="space-y-2">
                {formData.images.map((url, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={url}
                      onChange={(e) => updateImageUrl(index, e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => removeImageUrl(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addImageUrl}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Image URL
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                className="rounded"
              />
              <Label htmlFor="isActive">Active Package</Label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={() => setShowModal(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-syria-gold hover:bg-syria-dark-gold"
            >
              {submitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </div>
              ) : (
                editingPackage ? "Update Package" : "Create Package"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
