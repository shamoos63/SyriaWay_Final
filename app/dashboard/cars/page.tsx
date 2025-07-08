"use client"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, EyeOff, Eye, Plus, TrendingUp, Car, Users, Calendar, DollarSign, Clock, BarChart3, MoreVertical, Edit, Settings, User, Star } from "lucide-react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CarOwnerBookings } from "@/components/car-owner-bookings"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function CarOwnerDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const nextRouter = useRouter()
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tab, setTab] = useState("dashboard")
  const [cars, setCars] = useState<any[]>([])
  const [carsLoading, setCarsLoading] = useState(false)
  const [carsError, setCarsError] = useState<string | null>(null)
  const [revenueData, setRevenueData] = useState<any>(null)
  const [revenueLoading, setRevenueLoading] = useState(false)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: "",
    color: "",
    licensePlate: "",
    category: "",
    transmission: "",
    fuelType: "",
    seats: "",
    doors: "",
    pricePerDay: "",
    mileage: "",
    currentLocation: "",
    features: "",
    images: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [editingCar, setEditingCar] = useState<any>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [carToDelete, setCarToDelete] = useState<any>(null)
  const [updatingCar, setUpdatingCar] = useState<string | null>(null)
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    socialMedia: {
      facebook: "",
      instagram: "",
      twitter: "",
      linkedin: "",
    },
    businessInfo: {
      businessName: "",
      businessDescription: "",
      businessAddress: "",
      businessPhone: "",
      businessEmail: "",
    },
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [profileSubmitting, setProfileSubmitting] = useState(false)
  const [passwordSubmitting, setPasswordSubmitting] = useState(false)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null)
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null)
  const [carFilter, setCarFilter] = useState<'all' | 'available' | 'rented'>('all')
  const [customers, setCustomers] = useState<any[]>([])

  // Sync tab state with query string
  useEffect(() => {
    const tabParam = searchParams.get("tab")
    if (tabParam && tabParam !== tab) setTab(tabParam)
  }, [searchParams, tab])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/cars/owner/stats", {
          headers: {
            Authorization: `Bearer ${user?.id}`,
          },
        })
        if (response.ok) {
          const data = await response.json()
          setStats(data.stats)
        }
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchStats()
    }
  }, [user])

  // Fetch cars for Manage tab
  useEffect(() => {
    if (tab !== "manage" || !user || user.role !== "CAR_OWNER" || !user.id) return
    setCarsLoading(true)
    fetch("/api/cars/owner", {
      headers: { Authorization: `Bearer ${user.id}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch cars")
        const data = await res.json()
        setCars(data.cars)
        setCarsError(null)
      })
      .catch((err) => {
        setCarsError("Failed to fetch cars. Please check your connection or try again later.")
        setCars([])
      })
      .finally(() => setCarsLoading(false))
  }, [tab, user])

  // Fetch revenue data for Earnings tab
  useEffect(() => {
    if (tab !== "earnings" || !user || user.role !== "CAR_OWNER" || !user.id) return
    setRevenueLoading(true)
    fetch("/api/cars/owner/revenue", {
      headers: { Authorization: `Bearer ${user.id}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch revenue data")
        const data = await res.json()
        setRevenueData(data.revenue)
      })
      .catch((err) => {
        console.error("Error fetching revenue data:", err)
        setRevenueData(null)
      })
      .finally(() => setRevenueLoading(false))
  }, [tab, user])

  // Fetch customers data for Customers tab
  useEffect(() => {
    if (tab !== "customers" || !user || user.role !== "CAR_OWNER" || !user.id) return
    fetch("/api/cars/owner/customers", {
      headers: { Authorization: `Bearer ${user.id}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch customers data")
        const data = await res.json()
        setCustomers(data.customers)
      })
      .catch((err) => {
        console.error("Error fetching customers data:", err)
        setCustomers([])
      })
  }, [tab, user])

  // Load user profile data
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        socialMedia: {
          facebook: "",
          instagram: "",
          twitter: "",
          linkedin: "",
        },
        businessInfo: {
          businessName: "",
          businessDescription: "",
          businessAddress: "",
          businessPhone: "",
          businessEmail: "",
        },
      })
    }
  }, [user])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitError(null)

    try {
      const features = formData.features.split(",").map(f => f.trim()).filter(f => f)
      const images = formData.images.split(",").map(i => i.trim()).filter(i => i)

      const carData = {
        brand: formData.brand,
        model: formData.model,
        year: parseInt(formData.year),
        color: formData.color,
        licensePlate: formData.licensePlate,
        category: formData.category,
        transmission: formData.transmission,
        fuelType: formData.fuelType,
        seats: parseInt(formData.seats),
        doors: parseInt(formData.doors),
        pricePerDay: parseFloat(formData.pricePerDay),
        mileage: parseInt(formData.mileage),
        currentLocation: formData.currentLocation,
        features: features.length > 0 ? features : undefined,
        images: images.length > 0 ? images : undefined,
      }

      const response = await fetch("/api/cars/owner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.id}`,
        },
        body: JSON.stringify(carData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to add car")
      }

      // Reset form and close dialog
      setFormData({
        brand: "",
        model: "",
        year: "",
        color: "",
        licensePlate: "",
        category: "",
        transmission: "",
        fuelType: "",
        seats: "",
        doors: "",
        pricePerDay: "",
        mileage: "",
        currentLocation: "",
        features: "",
        images: "",
      })
      setShowAddDialog(false)

      // Refresh cars list
      setCarsLoading(true)
      const carsResponse = await fetch("/api/cars/owner", {
        headers: { Authorization: `Bearer ${user?.id}` },
      })
      if (carsResponse.ok) {
        const carsData = await carsResponse.json()
        setCars(carsData.cars)
      }
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Failed to add car")
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditCar = (car: any) => {
    setEditingCar(car)
    setFormData({
      brand: car.brand,
      model: car.model,
      year: car.year.toString(),
      color: car.color,
      licensePlate: car.licensePlate,
      category: car.category,
      transmission: car.transmission,
      fuelType: car.fuelType,
      seats: car.seats.toString(),
      doors: car.doors.toString(),
      pricePerDay: car.pricePerDay.toString(),
      mileage: car.mileage?.toString() || "",
      currentLocation: car.currentLocation || "",
      features: Array.isArray(car.features) ? car.features.join(", ") : "",
      images: Array.isArray(car.images) ? car.images.join(", ") : "",
    })
    setShowEditDialog(true)
  }

  const handleUpdateCar = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCar || !user?.id) return
    setSubmitting(true)
    setSubmitError(null)

    try {
      const features = formData.features.split(",").map(f => f.trim()).filter(f => f)
      const images = formData.images.split(",").map(i => i.trim()).filter(i => i)

      const carData = {
        brand: formData.brand,
        model: formData.model,
        year: parseInt(formData.year),
        color: formData.color,
        licensePlate: formData.licensePlate,
        category: formData.category,
        transmission: formData.transmission,
        fuelType: formData.fuelType,
        seats: parseInt(formData.seats),
        doors: parseInt(formData.doors),
        pricePerDay: parseFloat(formData.pricePerDay),
        mileage: parseInt(formData.mileage),
        currentLocation: formData.currentLocation,
        features: features.length > 0 ? features : undefined,
        images: images.length > 0 ? images : undefined,
      }

      const response = await fetch(`/api/cars/${editingCar.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.id}`,
        },
        body: JSON.stringify(carData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update car")
      }

      // Reset form and close dialog
      setEditingCar(null)
      setShowEditDialog(false)
      setFormData({
        brand: "",
        model: "",
        year: "",
        color: "",
        licensePlate: "",
        category: "",
        transmission: "",
        fuelType: "",
        seats: "",
        doors: "",
        pricePerDay: "",
        mileage: "",
        currentLocation: "",
        features: "",
        images: "",
      })

      // Refresh cars list
      setCarsLoading(true)
      const carsResponse = await fetch("/api/cars/owner", {
        headers: { Authorization: `Bearer ${user.id}` },
      })
      if (carsResponse.ok) {
        const carsData = await carsResponse.json()
        setCars(carsData.cars)
      }
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Failed to update car")
    } finally {
      setSubmitting(false)
    }
  }

  const handleToggleAvailability = async (car: any) => {
    if (!user?.id) return
    setUpdatingCar(car.id)
    try {
      const response = await fetch(`/api/cars/${car.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.id}`,
        },
        body: JSON.stringify({ isAvailable: !car.isAvailable }),
      })

      if (!response.ok) {
        throw new Error("Failed to update car availability")
      }

      // Update the car in the local state
      setCars(prev => prev.map(c => 
        c.id === car.id ? { ...c, isAvailable: !c.isAvailable } : c
      ))
    } catch (error) {
      console.error("Error updating car availability:", error)
    } finally {
      setUpdatingCar(null)
    }
  }

  const handleDeleteCar = async () => {
    if (!carToDelete || !user?.id) return
    setUpdatingCar(carToDelete.id)
    try {
      const response = await fetch(`/api/cars/${carToDelete.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.id}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to delete car")
      }

      // Remove the car from the local state
      setCars(prev => prev.filter(c => c.id !== carToDelete.id))
      setCarToDelete(null)
      setShowDeleteDialog(false)
    } catch (error) {
      console.error("Error deleting car:", error)
    } finally {
      setUpdatingCar(null)
    }
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id) return
    setProfileSubmitting(true)
    setProfileError(null)
    setProfileSuccess(null)

    try {
      const response = await fetch("/api/user/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.id}`,
        },
        body: JSON.stringify({
          name: profileData.name,
          email: profileData.email,
          phone: profileData.phone,
          socialMedia: profileData.socialMedia,
          businessInfo: profileData.businessInfo,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update profile")
      }

      setProfileSuccess("Profile updated successfully!")
    } catch (error) {
      setProfileError(error instanceof Error ? error.message : "Failed to update profile")
    } finally {
      setProfileSubmitting(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id) return
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match")
      return
    }
    setPasswordSubmitting(true)
    setPasswordError(null)
    setPasswordSuccess(null)

    try {
      const response = await fetch("/api/user/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.id}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to change password")
      }

      setPasswordSuccess("Password changed successfully!")
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error) {
      setPasswordError(error instanceof Error ? error.message : "Failed to change password")
    } finally {
      setPasswordSubmitting(false)
    }
  }

  if (!user || user.role !== "CAR_OWNER") return null

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-syria-gold"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {tab === "dashboard" && (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard Overview
          </h1>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total Cars
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats?.totalCars || 0}
                    </p>
                  </div>
                  <Car className="h-8 w-8 text-syria-gold" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total Bookings
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats?.totalBookings || 0}
                    </p>
                  </div>
                  <Calendar className="h-8 w-8 text-syria-gold" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Active Rentals
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats?.activeRentals || 0}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-syria-gold" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total Revenue
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      ${revenueData?.totalRevenue?.toFixed(2) || stats?.totalRevenue || 0}
                    </p>
                    {revenueData?.revenueGrowth !== undefined && revenueData.revenueGrowth !== 0 && (
                      <p className={`text-xs mt-1 ${revenueData.revenueGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {revenueData.revenueGrowth > 0 ? '+' : ''}{revenueData.revenueGrowth.toFixed(1)}% vs last month
                      </p>
                    )}
                  </div>
                  <DollarSign className="h-8 w-8 text-syria-gold" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Booking Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Pending</span>
                    <span className="font-medium">{stats?.pendingBookings || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Confirmed</span>
                    <span className="font-medium">{stats?.confirmedBookings || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Completed</span>
                    <span className="font-medium">{stats?.completedBookings || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Cancelled</span>
                    <span className="font-medium">{stats?.cancelledBookings || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">This Month</span>
                    <span className="font-medium">${revenueData?.monthlyRevenue?.toFixed(2) || stats?.monthlyRevenue || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Total</span>
                    <span className="font-medium">${revenueData?.totalRevenue?.toFixed(2) || stats?.totalRevenue || 0}</span>
                  </div>
                  {revenueData?.averagePerBooking && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Average per Booking</span>
                      <span className="font-medium">${revenueData.averagePerBooking.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Rentals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-3xl font-bold text-syria-gold">
                    {stats?.upcomingRentals || 0}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Scheduled rentals
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {tab === "manage" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Manage Cars
            </h1>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Car
            </Button>
          </div>

          {/* Car Filter Buttons */}
          <div className="flex gap-2 mb-4">
            <Button
              variant={carFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setCarFilter('all')}
            >
              All
            </Button>
            <Button
              variant={carFilter === 'available' ? 'default' : 'outline'}
              onClick={() => setCarFilter('available')}
            >
              Available
            </Button>
            <Button
              variant={carFilter === 'rented' ? 'default' : 'outline'}
              onClick={() => setCarFilter('rented')}
            >
              Rented
            </Button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-syria-gold"></div>
            </div>
          ) : error ? (
            <Card>
              <CardContent className="p-6 text-center text-red-600">
                {error}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cars
                .filter((car) => {
                  const now = new Date();
                  const hasFutureOrCurrentBooking = car.bookings?.some(
                    (booking: any) => new Date(booking.endDate) >= now
                  ) || false;
                  const isActuallyAvailable = car.isAvailable && !hasFutureOrCurrentBooking;
                  if (carFilter === 'available') return isActuallyAvailable;
                  if (carFilter === 'rented') return !isActuallyAvailable;
                  return true;
                })
                .map((car) => {
                  // Determine if car is actually available
                  const now = new Date();
                  const hasFutureOrCurrentBooking = car.bookings?.some(
                    (booking: any) => new Date(booking.endDate) >= now
                  ) || false;
                  const isActuallyAvailable = car.isAvailable && !hasFutureOrCurrentBooking;
                  return (
                    <Card key={car.id} className="overflow-hidden">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">
                              {car.brand} {car.model}
                            </CardTitle>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {car.year} • {car.color}
                            </p>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditCar(car)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setCarToDelete(car)
                                  setShowDeleteDialog(true)
                                }}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">License Plate:</span>
                            <span className="font-medium">{car.licensePlate}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Price/Day:</span>
                            <span className="font-medium">${car.pricePerDay}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Status:</span>
                            <Badge
                              variant={isActuallyAvailable ? "default" : "destructive"}
                              className={isActuallyAvailable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                            >
                              {isActuallyAvailable ? "Available" : "Rented"}
                            </Badge>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Verified:</span>
                            <Badge
                              variant={car.isVerified ? "default" : "outline"}
                              className={car.isVerified ? "bg-blue-100 text-blue-800" : ""}
                            >
                              {car.isVerified ? "Verified" : "Pending"}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
            </div>
          )}
        </div>
      )}

      {tab === "bookings" && (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Manage Bookings
          </h1>
          <CarOwnerBookings />
        </div>
      )}

      {tab === "customers" && (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Customer Management
          </h1>
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-syria-gold"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Customer Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Total Customers
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {customers?.length || 0}
                        </p>
                      </div>
                      <Users className="h-8 w-8 text-syria-gold" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Active Customers
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {customers?.filter(c => c.activeBookings > 0).length || 0}
                        </p>
                      </div>
                      <User className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Repeat Customers
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {customers?.filter(c => c.totalBookings > 1).length || 0}
                        </p>
                      </div>
                      <Star className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Customers List */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Customer List
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {customers && customers.length > 0 ? (
                    <div className="space-y-4">
                      {customers.map((customer) => (
                        <div key={customer.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-syria-gold rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold text-lg">
                                {customer.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">{customer.name}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{customer.email}</p>
                              {customer.phone && (
                                <p className="text-sm text-gray-600 dark:text-gray-400">{customer.phone}</p>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-4">
                              <div className="text-center">
                                <p className="text-sm text-gray-600 dark:text-gray-400">Total Bookings</p>
                                <p className="text-lg font-semibold">{customer.totalBookings}</p>
                              </div>
                              <div className="text-center">
                                <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
                                <p className="text-lg font-semibold text-green-600">{customer.activeBookings}</p>
                              </div>
                              <div className="text-center">
                                <p className="text-sm text-gray-600 dark:text-gray-400">Total Spent</p>
                                <p className="text-lg font-semibold text-syria-gold">${customer.totalSpent.toFixed(2)}</p>
                              </div>
                            </div>
                            <div className="mt-2">
                              <p className="text-xs text-gray-500">
                                Last booking: {customer.lastBookingDate ? new Date(customer.lastBookingDate).toLocaleDateString() : 'Never'}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400">
                        No customers found. Customers will appear here once they book your cars.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}

      {tab === "earnings" && (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Earnings & Revenue
          </h1>
          
          {revenueLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-syria-gold"></div>
            </div>
          ) : revenueData ? (
            <>
              {/* Revenue Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Total Revenue
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-syria-gold">
                        ${revenueData.totalRevenue.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        All time earnings
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      This Month
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-green-600">
                        ${revenueData.monthlyRevenue.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Monthly earnings
                      </p>
                      {revenueData.revenueGrowth !== 0 && (
                        <p className={`text-xs mt-1 ${revenueData.revenueGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {revenueData.revenueGrowth > 0 ? '+' : ''}{revenueData.revenueGrowth.toFixed(1)}% vs last month
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Average per Booking
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-blue-600">
                        ${revenueData.averagePerBooking.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Per booking average
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Total Bookings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-purple-600">
                        {revenueData.totalBookings}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Completed bookings
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Monthly Revenue Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Revenue Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {revenueData.monthlyBreakdown.map((month: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{month.month}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {month.bookings} booking{month.bookings !== 1 ? 's' : ''}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900 dark:text-white">
                            ${month.revenue.toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Avg: ${month.average.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Revenue by Car */}
              <Card>
                <CardHeader>
                  <CardTitle>Revenue by Car</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {revenueData.carRevenue.map((car: any, index: number) => (
                      <div key={car.carId} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">{car.carName}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{car.licensePlate}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900 dark:text-white">
                            ${car.totalRevenue.toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {car.totalBookings} booking{car.totalBookings !== 1 ? 's' : ''} • ${car.averagePerBooking.toFixed(2)} avg
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Transactions */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {revenueData.recentTransactions.length > 0 ? (
                      revenueData.recentTransactions.map((transaction: any) => (
                        <div key={transaction.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{transaction.carName}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {transaction.licensePlate} • {transaction.duration} day{transaction.duration !== 1 ? 's' : ''}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-900 dark:text-white">
                              ${transaction.amount.toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {new Date(transaction.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-400">
                          No completed transactions yet
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="p-6 text-center text-red-600">
                Failed to load revenue data. Please try again later.
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {tab === "settings" && (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Account Settings
          </h1>
          
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="profile-name">Full Name</Label>
                    <Input
                      id="profile-name"
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="profile-email">Email</Label>
                    <Input
                      id="profile-email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="profile-phone">Phone Number</Label>
                  <Input
                    id="profile-phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    placeholder="Enter your phone number"
                  />
                </div>
                
                {profileError && (
                  <div className="text-red-600 text-sm">{profileError}</div>
                )}
                {profileSuccess && (
                  <div className="text-green-600 text-sm">{profileSuccess}</div>
                )}
                
                <Button type="submit" disabled={profileSubmitting}>
                  {profileSubmitting ? "Updating..." : "Update Profile"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Password Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                    placeholder="Enter current password"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                      placeholder="Enter new password"
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
                
                {passwordError && (
                  <div className="text-red-600 text-sm">{passwordError}</div>
                )}
                {passwordSuccess && (
                  <div className="text-green-600 text-sm">{passwordSuccess}</div>
                )}
                
                <Button type="submit" disabled={passwordSubmitting}>
                  {passwordSubmitting ? "Changing..." : "Change Password"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Business Information */}
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  Business profile settings coming soon...
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add Car Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Car</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Car Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="brand">Brand *</Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => handleInputChange("brand", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="model">Model *</Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => handleInputChange("model", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="year">Year *</Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => handleInputChange("year", e.target.value)}
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  required
                />
              </div>
              <div>
                <Label htmlFor="color">Color *</Label>
                <Input
                  id="color"
                  value={formData.color}
                  onChange={(e) => handleInputChange("color", e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Additional Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="licensePlate">License Plate *</Label>
                <Input
                  id="licensePlate"
                  value={formData.licensePlate}
                  onChange={(e) => handleInputChange("licensePlate", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleInputChange("category", e.target.value)}
                  placeholder="e.g., Sedan, SUV, Luxury"
                  required
                />
              </div>
            </div>

            {/* Technical Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="transmission">Transmission *</Label>
                <Input
                  id="transmission"
                  value={formData.transmission}
                  onChange={(e) => handleInputChange("transmission", e.target.value)}
                  placeholder="Manual/Automatic"
                  required
                />
              </div>
              <div>
                <Label htmlFor="fuelType">Fuel Type *</Label>
                <Input
                  id="fuelType"
                  value={formData.fuelType}
                  onChange={(e) => handleInputChange("fuelType", e.target.value)}
                  placeholder="Gasoline/Diesel/Electric"
                  required
                />
              </div>
              <div>
                <Label htmlFor="seats">Seats *</Label>
                <Input
                  id="seats"
                  type="number"
                  value={formData.seats}
                  onChange={(e) => handleInputChange("seats", e.target.value)}
                  min="1"
                  max="20"
                  required
                />
              </div>
            </div>

            {/* Pricing and Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pricePerDay">Price per Day ($) *</Label>
                <Input
                  id="pricePerDay"
                  type="number"
                  value={formData.pricePerDay}
                  onChange={(e) => handleInputChange("pricePerDay", e.target.value)}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <Label htmlFor="currentLocation">Current Location</Label>
                <Input
                  id="currentLocation"
                  value={formData.currentLocation}
                  onChange={(e) => handleInputChange("currentLocation", e.target.value)}
                  placeholder="City, Country"
                />
              </div>
            </div>

            {/* Additional Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="doors">Doors</Label>
                <Input
                  id="doors"
                  type="number"
                  value={formData.doors}
                  onChange={(e) => handleInputChange("doors", e.target.value)}
                  min="2"
                  max="6"
                />
              </div>
              <div>
                <Label htmlFor="mileage">Mileage (km)</Label>
                <Input
                  id="mileage"
                  type="number"
                  value={formData.mileage}
                  onChange={(e) => handleInputChange("mileage", e.target.value)}
                  min="0"
                />
              </div>
            </div>

            {/* Features and Images */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="features">Features (comma-separated)</Label>
                <Textarea
                  id="features"
                  value={formData.features}
                  onChange={(e) => handleInputChange("features", e.target.value)}
                  placeholder="GPS, Bluetooth, Air Conditioning, etc."
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="images">Image URLs (comma-separated)</Label>
                <Textarea
                  id="images"
                  value={formData.images}
                  onChange={(e) => handleInputChange("images", e.target.value)}
                  placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                  rows={3}
                />
              </div>
            </div>

            {submitError && (
              <div className="text-red-600 text-sm">{submitError}</div>
            )}

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddDialog(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Adding..." : "Add Car"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Car Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Car</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateCar} className="space-y-6">
            {/* Car Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-brand">Brand *</Label>
                <Input
                  id="edit-brand"
                  value={formData.brand}
                  onChange={(e) => handleInputChange("brand", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-model">Model *</Label>
                <Input
                  id="edit-model"
                  value={formData.model}
                  onChange={(e) => handleInputChange("model", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-year">Year *</Label>
                <Input
                  id="edit-year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => handleInputChange("year", e.target.value)}
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-color">Color *</Label>
                <Input
                  id="edit-color"
                  value={formData.color}
                  onChange={(e) => handleInputChange("color", e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Additional Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-licensePlate">License Plate *</Label>
                <Input
                  id="edit-licensePlate"
                  value={formData.licensePlate}
                  onChange={(e) => handleInputChange("licensePlate", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-category">Category *</Label>
                <Input
                  id="edit-category"
                  value={formData.category}
                  onChange={(e) => handleInputChange("category", e.target.value)}
                  placeholder="e.g., Sedan, SUV, Luxury"
                  required
                />
              </div>
            </div>

            {/* Technical Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="edit-transmission">Transmission *</Label>
                <Input
                  id="edit-transmission"
                  value={formData.transmission}
                  onChange={(e) => handleInputChange("transmission", e.target.value)}
                  placeholder="Manual/Automatic"
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-fuelType">Fuel Type *</Label>
                <Input
                  id="edit-fuelType"
                  value={formData.fuelType}
                  onChange={(e) => handleInputChange("fuelType", e.target.value)}
                  placeholder="Gasoline/Diesel/Electric"
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-seats">Seats *</Label>
                <Input
                  id="edit-seats"
                  type="number"
                  value={formData.seats}
                  onChange={(e) => handleInputChange("seats", e.target.value)}
                  min="1"
                  max="20"
                  required
                />
              </div>
            </div>

            {/* Pricing and Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-pricePerDay">Price per Day ($) *</Label>
                <Input
                  id="edit-pricePerDay"
                  type="number"
                  value={formData.pricePerDay}
                  onChange={(e) => handleInputChange("pricePerDay", e.target.value)}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-currentLocation">Current Location</Label>
                <Input
                  id="edit-currentLocation"
                  value={formData.currentLocation}
                  onChange={(e) => handleInputChange("currentLocation", e.target.value)}
                  placeholder="City, Country"
                />
              </div>
            </div>

            {/* Additional Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-doors">Doors</Label>
                <Input
                  id="edit-doors"
                  type="number"
                  value={formData.doors}
                  onChange={(e) => handleInputChange("doors", e.target.value)}
                  min="2"
                  max="6"
                />
              </div>
              <div>
                <Label htmlFor="edit-mileage">Mileage (km)</Label>
                <Input
                  id="edit-mileage"
                  type="number"
                  value={formData.mileage}
                  onChange={(e) => handleInputChange("mileage", e.target.value)}
                  min="0"
                />
              </div>
            </div>

            {/* Features and Images */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-features">Features (comma-separated)</Label>
                <Textarea
                  id="edit-features"
                  value={formData.features}
                  onChange={(e) => handleInputChange("features", e.target.value)}
                  placeholder="GPS, Bluetooth, Air Conditioning, etc."
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="edit-images">Image URLs (comma-separated)</Label>
                <Textarea
                  id="edit-images"
                  value={formData.images}
                  onChange={(e) => handleInputChange("images", e.target.value)}
                  placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                  rows={3}
                />
              </div>
            </div>

            {submitError && (
              <div className="text-red-600 text-sm">{submitError}</div>
            )}

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowEditDialog(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Updating..." : "Update Car"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the car
              "{carToDelete?.brand} {carToDelete?.model}" and all its associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCar}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 