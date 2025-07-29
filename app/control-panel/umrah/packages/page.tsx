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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface UmrahPackageTranslation {
  id: number
  packageId: number
  language: string
  name: string
  description: string | null
}

interface UmrahPackage {
  id: string
  name: string
  description: string | null
  duration: number
  price: number
  currency: string
  maxPilgrims: number | null
  currentPilgrims: number
  startDate: string
  endDate: string
  isActive: boolean
  isVerified: boolean
  createdAt: string
  updatedAt: string
  translations: UmrahPackageTranslation[]
}

export default function UmrahPackagesPage() {
  const { t, language, dir } = useLanguage()
  const { user } = useAuth()
  const [packages, setPackages] = useState<UmrahPackage[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingPackage, setEditingPackage] = useState<UmrahPackage | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [translations, setTranslations] = useState<UmrahPackageTranslation[]>([])
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    duration: "",
    price: "",
    currency: "USD",
    maxPilgrims: "",
    startDate: "",
    endDate: "",
    isActive: true
  })

  const languages = [
    { code: 'ENGLISH', name: 'English' },
    { code: 'ARABIC', name: 'العربية' },
    { code: 'FRENCH', name: 'Français' }
  ]

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
      price: "",
      currency: "USD",
      maxPilgrims: "",
      startDate: "",
      endDate: "",
      isActive: true
    })
    setTranslations([])
    setShowModal(true)
  }

  const handleEdit = (pkg: UmrahPackage) => {
    setEditingPackage(pkg)
    setFormData({
      name: pkg.name,
      description: pkg.description || "",
      duration: pkg.duration.toString(),
      price: pkg.price.toString(),
      currency: pkg.currency,
      maxPilgrims: pkg.maxPilgrims?.toString() || "",
      startDate: pkg.startDate,
      endDate: pkg.endDate,
      isActive: pkg.isActive
    })
    setTranslations(pkg.translations || [])
    setShowModal(true)
  }

  const handleSubmit = async () => {
    if (!formData.name || !formData.duration || !formData.price || !formData.startDate || !formData.endDate) {
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
          price: parseFloat(formData.price),
          maxPilgrims: formData.maxPilgrims ? parseInt(formData.maxPilgrims) : null,
          translations
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



  const updateTranslation = (language: string, field: 'name' | 'description', value: string) => {
    setTranslations(prev => {
      const existing = prev.find(t => t.language === language)
      if (existing) {
        return prev.map(t => 
          t.language === language ? { ...t, [field]: value } : t
        )
      } else {
        return [...prev, { id: 0, packageId: 0, language, name: '', description: '', [field]: value }]
      }
    })
  }

  const getTranslationValue = (language: string, field: 'name' | 'description') => {
    const translation = translations.find(t => t.language === language)
    return translation?.[field] || ''
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
              <div className="relative h-48 w-full bg-gradient-to-br from-syria-gold/20 to-syria-dark-gold/20 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2">🕋</div>
                  <div className="text-sm text-gray-600">Umrah Package</div>
                </div>
                <div className="absolute top-2 right-2">
                  <Badge variant={pkg.isActive ? "default" : "secondary"}>
                    {pkg.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{pkg.name}</CardTitle>
                <CardDescription className="line-clamp-2">{pkg.description}</CardDescription>
                {pkg.translations && pkg.translations.length > 0 && (
                  <div className="flex gap-1 mt-2">
                    {pkg.translations.map((translation) => (
                      <Badge key={translation.language} variant="outline" className="text-xs">
                        {translation.language}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-syria-gold" />
                    <span>{pkg.duration} days</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-syria-gold" />
                    <span>{pkg.maxPilgrims || 'Unlimited'} pilgrims</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-syria-gold" />
                    <span>${pkg.price} {pkg.currency}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-xs text-gray-500">
                      {new Date(pkg.startDate).toLocaleDateString()} - {new Date(pkg.endDate).toLocaleDateString()}
                    </span>
                  </div>
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
          
          <Tabs defaultValue="ENGLISH" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              {languages.map((lang) => (
                <TabsTrigger key={lang.code} value={lang.code}>
                  {lang.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {languages.map((lang) => (
              <TabsContent key={lang.code} value={lang.code} className="space-y-4">
                <div>
                  <Label htmlFor={`name-${lang.code}`}>Name ({lang.name}) *</Label>
                  <Input
                    id={`name-${lang.code}`}
                    value={lang.code === 'ENGLISH' ? formData.name : getTranslationValue(lang.code, 'name')}
                    onChange={(e) => {
                      if (lang.code === 'ENGLISH') {
                        setFormData(prev => ({ ...prev, name: e.target.value }))
                      } else {
                        updateTranslation(lang.code, 'name', e.target.value)
                      }
                    }}
                    placeholder={`Package name in ${lang.name}`}
                  />
                </div>
                <div>
                  <Label htmlFor={`description-${lang.code}`}>Description ({lang.name})</Label>
                  <Textarea
                    id={`description-${lang.code}`}
                    value={lang.code === 'ENGLISH' ? formData.description : getTranslationValue(lang.code, 'description')}
                    onChange={(e) => {
                      if (lang.code === 'ENGLISH') {
                        setFormData(prev => ({ ...prev, description: e.target.value }))
                      } else {
                        updateTranslation(lang.code, 'description', e.target.value)
                      }
                    }}
                    placeholder={`Package description in ${lang.name}`}
                    rows={3}
                  />
                </div>
              </TabsContent>
            ))}
          </Tabs>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div>
                <Label htmlFor="maxPilgrims">Maximum Pilgrims</Label>
                <Input
                  id="maxPilgrims"
                  type="number"
                  min="1"
                  value={formData.maxPilgrims}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxPilgrims: e.target.value }))}
                  placeholder="50"
                />
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                />
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
