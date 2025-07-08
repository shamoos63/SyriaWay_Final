"use client"
import { useLanguage } from "@/lib/i18n/language-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Edit, UserPlus, Mail, Ban, CheckCircle, Hotel, Car, Plane, Globe, Eye, Loader2, Trash2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Provider {
  id: string;
  name: string | null;
  email: string;
  role: string;
  status: string;
  phone: string | null;
  preferredLang: string;
  createdAt: string;
  lastLoginAt: string | null;
  image: string | null;
}

export default function ProvidersManagement() {
  const { t } = useLanguage()
  const [providers, setProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [search, setSearch] = useState("")
  const [type, setType] = useState("all")
  
  // Dialog states
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false)
  const [isAddProviderOpen, setIsAddProviderOpen] = useState(false)
  const [isDeleteProviderOpen, setIsDeleteProviderOpen] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  
  // Form states
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: ""
  })
  const [addForm, setAddForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    role: "HOTEL_OWNER",
    // Hotel fields
    hotelName: "",
    hotelDescription: "",
    hotelAddress: "",
    hotelCity: "",
    hotelPhone: "",
    hotelEmail: "",
    hotelWebsite: "",
    hotelStarRating: 3,
    hotelCheckInTime: "14:00",
    hotelCheckOutTime: "12:00"
  })
  const [emailForm, setEmailForm] = useState({
    subject: "",
    message: ""
  })

  useEffect(() => {
    fetchProviders()
  }, [search, type])

  const fetchProviders = async () => {
    try {
      setLoading(true)
      let url = `/api/admin/users?role=HOTEL_OWNER&role=CAR_OWNER&role=TOUR_GUIDE`
      if (search) url += `&search=${encodeURIComponent(search)}`
      if (type && type !== "all") url += `&providerType=${type}`
      const res = await fetch(url)
      if (res.ok) {
        const data = await res.json()
        setProviders(data.users)
      } else {
        setError("Failed to fetch providers")
      }
    } catch (e) {
      setError("Error fetching providers")
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (providerId: string, newStatus: string) => {
    try {
      setActionLoading(true)
      const response = await fetch(`/api/admin/users/${providerId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        setSuccess(`Provider ${newStatus.toLowerCase()} successfully`)
        fetchProviders() // Refresh the list
        setTimeout(() => setSuccess(""), 3000)
      } else {
        const data = await response.json()
        setError(data.error || "Failed to update status")
      }
    } catch (error) {
      setError("Error updating status")
    } finally {
      setActionLoading(false)
    }
  }

  const handleEdit = async () => {
    if (!selectedProvider) return

    try {
      setActionLoading(true)
      const response = await fetch(`/api/admin/users/${selectedProvider.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${editForm.firstName} ${editForm.lastName}`,
          email: editForm.email,
          phone: editForm.phone || undefined,
          role: editForm.role,
        }),
      })

      if (response.ok) {
        setSuccess("Provider updated successfully")
        setIsEditDialogOpen(false)
        setSelectedProvider(null)
        fetchProviders()
        setTimeout(() => setSuccess(""), 3000)
      } else {
        const data = await response.json()
        setError(data.error || "Failed to update provider")
      }
    } catch (error) {
      setError("Error updating provider")
    } finally {
      setActionLoading(false)
    }
  }

  const handleSendEmail = async () => {
    if (!selectedProvider) return

    try {
      setActionLoading(true)
      const response = await fetch(`/api/admin/users/${selectedProvider.id}/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailForm),
      })

      if (response.ok) {
        setSuccess("Email sent successfully")
        setIsEmailDialogOpen(false)
        setSelectedProvider(null)
        setEmailForm({ subject: "", message: "" })
        setTimeout(() => setSuccess(""), 3000)
      } else {
        const data = await response.json()
        setError(data.error || "Failed to send email")
      }
    } catch (error) {
      setError("Error sending email")
    } finally {
      setActionLoading(false)
    }
  }

  const handleAddProvider = async () => {
    try {
      setActionLoading(true)
      
      // Validate hotel fields if role is HOTEL_OWNER
      if (addForm.role === "HOTEL_OWNER") {
        if (!addForm.hotelName || !addForm.hotelAddress || !addForm.hotelCity) {
          setError("Hotel name, address, and city are required for hotel owners")
          setActionLoading(false)
          return
        }
      }

      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${addForm.firstName} ${addForm.lastName}`,
          email: addForm.email,
          password: addForm.password,
          role: addForm.role,
          phone: addForm.phone || undefined,
          // Include hotel data if it's a hotel owner
          hotel: addForm.role === "HOTEL_OWNER" ? {
            name: addForm.hotelName,
            description: addForm.hotelDescription || undefined,
            address: addForm.hotelAddress,
            city: addForm.hotelCity,
            phone: addForm.hotelPhone || undefined,
            email: addForm.hotelEmail || undefined,
            website: addForm.hotelWebsite || undefined,
            starRating: addForm.hotelStarRating,
            checkInTime: addForm.hotelCheckInTime,
            checkOutTime: addForm.hotelCheckOutTime
          } : undefined
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("Provider created successfully!")
        setIsAddProviderOpen(false)
        setAddForm({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          phone: "",
          role: "HOTEL_OWNER",
          // Hotel fields
          hotelName: "",
          hotelDescription: "",
          hotelAddress: "",
          hotelCity: "",
          hotelPhone: "",
          hotelEmail: "",
          hotelWebsite: "",
          hotelStarRating: 3,
          hotelCheckInTime: "14:00",
          hotelCheckOutTime: "12:00"
        })
        fetchProviders() // Refresh the list
        setTimeout(() => setSuccess(""), 3000)
      } else {
        setError(data.error || "Failed to create provider")
      }
    } catch (error) {
      setError("Error creating provider")
    } finally {
      setActionLoading(false)
    }
  }

  const handleDeleteProvider = async () => {
    if (!selectedProvider) return

    try {
      setActionLoading(true)
      const response = await fetch(`/api/admin/users/${selectedProvider.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setSuccess("Provider deleted successfully!")
        setIsDeleteProviderOpen(false)
        setSelectedProvider(null)
        fetchProviders() // Refresh the list
        setTimeout(() => setSuccess(""), 3000)
      } else {
        const data = await response.json()
        setError(data.error || "Failed to delete provider")
      }
    } catch (error) {
      setError("Error deleting provider")
    } finally {
      setActionLoading(false)
    }
  }

  const openEditDialog = (provider: Provider) => {
    const [firstName, ...lastNameParts] = (provider.name || "").split(" ")
    const lastName = lastNameParts.join(" ")
    
    setEditForm({
      firstName: firstName || "",
      lastName: lastName || "",
      email: provider.email,
      phone: provider.phone || "",
      role: provider.role
    })
    setSelectedProvider(provider)
    setIsEditDialogOpen(true)
  }

  const openEmailDialog = (provider: Provider) => {
    setSelectedProvider(provider)
    setIsEmailDialogOpen(true)
  }

  const openDeleteDialog = (provider: Provider) => {
    setSelectedProvider(provider)
    setIsDeleteProviderOpen(true)
  }

  // Helper to map role to type label and icon
  const getTypeInfo = (role: string) => {
    switch (role) {
      case "HOTEL_OWNER":
        return { label: "Hotel", icon: <Hotel className="h-4 w-4 text-blue-500" /> }
      case "CAR_OWNER":
        return { label: "Car Rental", icon: <Car className="h-4 w-4 text-green-500" /> }
      case "TOUR_GUIDE":
        return { label: "Tour Operator", icon: <Globe className="h-4 w-4 text-amber-500" /> }
      default:
        return { label: role, icon: <UserPlus className="h-4 w-4 text-gray-500" /> }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t.controlPanel?.serviceProviders || "Service Providers"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t.controlPanel?.manageServiceProviders || "Manage hotel, car rental, and other service provider accounts"}
          </p>
        </div>
        <Button onClick={() => setIsAddProviderOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          {t.controlPanel?.addProvider || "Add Provider"}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50 text-green-800">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{t.controlPanel?.allProviders || "All Providers"}</CardTitle>
          <CardDescription>
            {t.controlPanel?.viewAndManageProviders || "View and manage all service provider accounts"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder={t.controlPanel?.searchProviders || "Search providers..."} className="pl-8" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder={t.controlPanel?.filterByType || "Filter by type"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.controlPanel?.allTypes || "All Types"}</SelectItem>
                <SelectItem value="HOTEL_OWNER">{t.controlPanel?.hotels || "Hotels"}</SelectItem>
                <SelectItem value="CAR_OWNER">{t.controlPanel?.carRentals || "Car Rentals"}</SelectItem>
                <SelectItem value="TOUR_GUIDE">{t.controlPanel?.tourOperators || "Tour Operators"}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border min-h-[120px]">
            {loading ? (
              <div className="p-6 text-center">Loading...</div>
            ) : error ? (
              <div className="p-6 text-center text-red-500">{error}</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t.controlPanel?.provider || "Provider"}</TableHead>
                    <TableHead>{t.controlPanel?.type || "Type"}</TableHead>
                    <TableHead>{t.controlPanel?.status || "Status"}</TableHead>
                    <TableHead className="text-right">{t.controlPanel?.actions || "Actions"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {providers
                    .filter((provider) => type === "all" || provider.role === type)
                    .map((provider, index) => {
                      const typeInfo = getTypeInfo(provider.role)
                      return (
                        <TableRow key={provider.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={provider.image || undefined} />
                                <AvatarFallback>{provider.name?.split(" ").map((n:any) => n[0]).join("")}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{provider.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {typeInfo.icon}
                              {typeInfo.label}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                              provider.status === "ACTIVE"
                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                : provider.status === "INACTIVE"
                                  ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            }`}>
                              {provider.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                title={t.controlPanel?.edit || "Edit"}
                                onClick={() => openEditDialog(provider)}
                                disabled={actionLoading}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                title={t.controlPanel?.email || "Email"}
                                onClick={() => openEmailDialog(provider)}
                                disabled={actionLoading}
                              >
                                <Mail className="h-4 w-4" />
                              </Button>
                              {provider.status === "ACTIVE" ? (
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  title={t.controlPanel?.suspend || "Suspend"}
                                  onClick={() => handleStatusChange(provider.id, "SUSPENDED")}
                                  disabled={actionLoading}
                                >
                                  {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Ban className="h-4 w-4" />}
                                </Button>
                              ) : (
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  title={t.controlPanel?.activate || "Activate"}
                                  onClick={() => handleStatusChange(provider.id, "ACTIVE")}
                                  disabled={actionLoading}
                                >
                                  {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                                </Button>
                              )}
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                title="Delete"
                                onClick={() => openDeleteDialog(provider)}
                                disabled={actionLoading}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Provider Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Provider</DialogTitle>
            <DialogDescription>
              Update provider information
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={editForm.firstName}
                  onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={editForm.lastName}
                  onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Provider Type</Label>
              <Select 
                value={editForm.role}
                onValueChange={(value) => setEditForm({ ...editForm, role: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select provider type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HOTEL_OWNER">Hotel Owner</SelectItem>
                  <SelectItem value="CAR_OWNER">Car Rental Owner</SelectItem>
                  <SelectItem value="TOUR_GUIDE">Tour Guide</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEdit} disabled={actionLoading}>
              {actionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Update Provider
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Email Provider Dialog */}
      <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Send Email to {selectedProvider?.name}</DialogTitle>
            <DialogDescription>
              Send a message to {selectedProvider?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={emailForm.subject}
                onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
                placeholder="Enter email subject"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={emailForm.message}
                onChange={(e) => setEmailForm({ ...emailForm, message: e.target.value })}
                placeholder="Enter your message"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEmailDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendEmail} disabled={actionLoading}>
              {actionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Send Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Provider Dialog */}
      <Dialog open={isAddProviderOpen} onOpenChange={setIsAddProviderOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Provider</DialogTitle>
            <DialogDescription>
              Create a new service provider account
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="addFirstName">First Name</Label>
                <Input
                  id="addFirstName"
                  value={addForm.firstName}
                  onChange={(e) => setAddForm({ ...addForm, firstName: e.target.value })}
                  placeholder="John"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="addLastName">Last Name</Label>
                <Input
                  id="addLastName"
                  value={addForm.lastName}
                  onChange={(e) => setAddForm({ ...addForm, lastName: e.target.value })}
                  placeholder="Doe"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="addEmail">Email</Label>
              <Input
                id="addEmail"
                type="email"
                value={addForm.email}
                onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                placeholder="john.doe@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="addPassword">Password</Label>
              <Input
                id="addPassword"
                type="password"
                value={addForm.password}
                onChange={(e) => setAddForm({ ...addForm, password: e.target.value })}
                placeholder="Enter password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="addRole">Provider Type</Label>
              <Select 
                value={addForm.role}
                onValueChange={(value) => setAddForm({ ...addForm, role: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select provider type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HOTEL_OWNER">Hotel Owner</SelectItem>
                  <SelectItem value="CAR_OWNER">Car Rental Owner</SelectItem>
                  <SelectItem value="TOUR_GUIDE">Tour Guide</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="addPhone">Phone (Optional)</Label>
              <Input
                id="addPhone"
                value={addForm.phone}
                onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })}
                placeholder="+963-11-1234567"
              />
            </div>
            
            {/* Hotel Information Fields - Only show when HOTEL_OWNER is selected */}
            {addForm.role === "HOTEL_OWNER" && (
              <>
                <div className="border-t pt-4 mt-4">
                  <h3 className="text-lg font-semibold mb-4">Hotel Information</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="hotelName">Hotel Name *</Label>
                    <Input
                      id="hotelName"
                      value={addForm.hotelName}
                      onChange={(e) => setAddForm({ ...addForm, hotelName: e.target.value })}
                      placeholder="Grand Hotel Damascus"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="hotelDescription">Description</Label>
                    <Textarea
                      id="hotelDescription"
                      value={addForm.hotelDescription}
                      onChange={(e) => setAddForm({ ...addForm, hotelDescription: e.target.value })}
                      placeholder="Brief description of the hotel..."
                      rows={2}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="hotelAddress">Address *</Label>
                      <Input
                        id="hotelAddress"
                        value={addForm.hotelAddress}
                        onChange={(e) => setAddForm({ ...addForm, hotelAddress: e.target.value })}
                        placeholder="123 Main Street"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hotelCity">City *</Label>
                      <Input
                        id="hotelCity"
                        value={addForm.hotelCity}
                        onChange={(e) => setAddForm({ ...addForm, hotelCity: e.target.value })}
                        placeholder="Damascus"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="hotelPhone">Hotel Phone</Label>
                      <Input
                        id="hotelPhone"
                        value={addForm.hotelPhone}
                        onChange={(e) => setAddForm({ ...addForm, hotelPhone: e.target.value })}
                        placeholder="+963-11-1234567"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hotelEmail">Hotel Email</Label>
                      <Input
                        id="hotelEmail"
                        type="email"
                        value={addForm.hotelEmail}
                        onChange={(e) => setAddForm({ ...addForm, hotelEmail: e.target.value })}
                        placeholder="info@hotel.com"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="hotelWebsite">Website</Label>
                    <Input
                      id="hotelWebsite"
                      value={addForm.hotelWebsite}
                      onChange={(e) => setAddForm({ ...addForm, hotelWebsite: e.target.value })}
                      placeholder="https://www.hotel.com"
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="hotelStarRating">Star Rating</Label>
                      <Select 
                        value={addForm.hotelStarRating.toString()}
                        onValueChange={(value) => setAddForm({ ...addForm, hotelStarRating: parseInt(value) })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 Star</SelectItem>
                          <SelectItem value="2">2 Stars</SelectItem>
                          <SelectItem value="3">3 Stars</SelectItem>
                          <SelectItem value="4">4 Stars</SelectItem>
                          <SelectItem value="5">5 Stars</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hotelCheckInTime">Check-in Time</Label>
                      <Input
                        id="hotelCheckInTime"
                        type="time"
                        value={addForm.hotelCheckInTime}
                        onChange={(e) => setAddForm({ ...addForm, hotelCheckInTime: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hotelCheckOutTime">Check-out Time</Label>
                      <Input
                        id="hotelCheckOutTime"
                        type="time"
                        value={addForm.hotelCheckOutTime}
                        onChange={(e) => setAddForm({ ...addForm, hotelCheckOutTime: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddProviderOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddProvider} disabled={actionLoading}>
              {actionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Add Provider
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Provider Dialog */}
      <Dialog open={isDeleteProviderOpen} onOpenChange={setIsDeleteProviderOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Provider</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedProvider?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteProviderOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteProvider} disabled={actionLoading}>
              {actionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
