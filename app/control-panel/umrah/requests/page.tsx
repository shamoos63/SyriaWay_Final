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
import { Eye, MessageSquare, Phone, Mail, Calendar, Users, DollarSign, Clock } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface UmrahRequest {
  id: string
  customerId: string
  packageId: string
  preferredDates: string | null
  groupSize: number
  specialRequirements: string | null
  phoneNumber: string | null
  alternativeEmail: string | null
  message: string | null
  status: string
  adminNotes: string | null
  createdAt: string
  updatedAt: string
  customer: {
    id: string
    name: string
    email: string
  }
  package: {
    id: string
    name: string
    price: number
    currency: string
    duration: number
    groupSize: string
    season: string | null
  }
}

export default function UmrahRequestsPage() {
  const { t, language, dir } = useLanguage()
  const { user } = useAuth()
  const [requests, setRequests] = useState<UmrahRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<UmrahRequest | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [adminNotes, setAdminNotes] = useState("")
  const [newStatus, setNewStatus] = useState("")

  useEffect(() => {
    fetchRequests()
  }, [statusFilter])

  const fetchRequests = async () => {
    setLoading(true)
    try {
      console.log('Fetching requests with user ID:', user?.id)
      const res = await fetch(`/api/admin/umrah/requests?status=${statusFilter}`, {
        headers: {
          'Authorization': `Bearer ${user?.id}`
        }
      })
      console.log('Response status:', res.status)
      if (!res.ok) {
        const errorData = await res.json()
        console.error('API Error:', errorData)
        throw new Error('Failed to fetch requests')
      }
      const data = await res.json()
      setRequests(data.requests)
    } catch (error) {
      console.error('Error fetching requests:', error)
      toast({
        title: "Error",
        description: "Failed to load Umrah requests",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = (request: UmrahRequest) => {
    setSelectedRequest(request)
    setAdminNotes(request.adminNotes || "")
    setNewStatus(request.status)
    setShowModal(true)
  }

  const handleUpdateStatus = async () => {
    if (!selectedRequest) return

    setSubmitting(true)
    try {
      const res = await fetch(`/api/admin/umrah/requests/${selectedRequest.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.id}`
        },
        body: JSON.stringify({
          status: newStatus,
          adminNotes: adminNotes
        })
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to update request')
      }

      toast({
        title: "Success",
        description: "Request updated successfully",
        variant: "default"
      })

      setShowModal(false)
      fetchRequests()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update request",
        variant: "destructive"
      })
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { variant: "secondary" as const, label: "Pending" },
      CONTACTED: { variant: "default" as const, label: "Contacted" },
      CONFIRMED: { variant: "default" as const, label: "Confirmed" },
      CANCELLED: { variant: "destructive" as const, label: "Cancelled" }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="space-y-6" dir={dir}>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">
            {language === "ar" ? "إدارة طلبات العمرة" : language === "fr" ? "Gestion des Demandes Omra" : "Umrah Requests Management"}
          </h1>
          <p className="text-muted-foreground">
            {language === "ar" 
              ? "إدارة طلبات العمرة من العملاء" 
              : language === "fr" 
                ? "Gérer les demandes Omra des clients"
                : "Manage Umrah requests from customers"}
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="CONTACTED">Contacted</SelectItem>
              <SelectItem value="CONFIRMED">Confirmed</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-syria-gold"></div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {requests.map((request) => (
            <Card key={request.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{request.customer.name}</CardTitle>
                    <CardDescription>{request.package.name}</CardDescription>
                  </div>
                  {getStatusBadge(request.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-syria-gold" />
                    <span>{request.groupSize} people</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-syria-gold" />
                    <span>${request.package.price} {request.package.currency}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-syria-gold" />
                    <span>{request.package.duration} days</span>
                  </div>
                  {request.preferredDates && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-syria-gold" />
                      <span>{request.preferredDates}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-syria-gold" />
                    <span className="truncate">{request.customer.email}</span>
                  </div>
                  {request.phoneNumber && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-syria-gold" />
                      <span>{request.phoneNumber}</span>
                    </div>
                  )}
                </div>
                
                {request.message && (
                  <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                      {request.message}
                    </p>
                  </div>
                )}

                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>Requested: {formatDate(request.createdAt)}</span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewDetails(request)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {requests.length === 0 && !loading && (
        <div className="text-center py-12">
          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">
            {language === "ar" 
              ? "لا توجد طلبات عمرة حالياً" 
              : language === "fr" 
                ? "Aucune demande Omra pour le moment"
                : "No Umrah requests at the moment"}
          </p>
        </div>
      )}

      {/* Request Details Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {language === "ar" ? "تفاصيل الطلب" : language === "fr" ? "Détails de la Demande" : "Request Details"}
            </DialogTitle>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-6">
              {/* Customer Information */}
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-3">Customer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Name</Label>
                    <p className="text-sm">{selectedRequest.customer.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Email</Label>
                    <p className="text-sm">{selectedRequest.customer.email}</p>
                  </div>
                  {selectedRequest.phoneNumber && (
                    <div>
                      <Label className="text-sm font-medium">Phone</Label>
                      <p className="text-sm">{selectedRequest.phoneNumber}</p>
                    </div>
                  )}
                  {selectedRequest.alternativeEmail && (
                    <div>
                      <Label className="text-sm font-medium">Email</Label>
                      <p className="text-sm">{selectedRequest.alternativeEmail}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Package Information */}
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-3">Package Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Package Name</Label>
                    <p className="text-sm">{selectedRequest.package.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Price</Label>
                    <p className="text-sm">${selectedRequest.package.price} {selectedRequest.package.currency}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Duration</Label>
                    <p className="text-sm">{selectedRequest.package.duration} days</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Group Size</Label>
                    <p className="text-sm">{selectedRequest.package.groupSize}</p>
                  </div>
                  {selectedRequest.package.season && (
                    <div>
                      <Label className="text-sm font-medium">Season</Label>
                      <p className="text-sm">{selectedRequest.package.season}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Request Details */}
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-3">Request Details</h3>
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">Number of People</Label>
                    <p className="text-sm">{selectedRequest.groupSize} people</p>
                  </div>
                  {selectedRequest.preferredDates && (
                    <div>
                      <Label className="text-sm font-medium">Preferred Dates</Label>
                      <p className="text-sm">{selectedRequest.preferredDates}</p>
                    </div>
                  )}
                  {selectedRequest.specialRequirements && (
                    <div>
                      <Label className="text-sm font-medium">Special Requirements</Label>
                      <p className="text-sm">{selectedRequest.specialRequirements}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Admin Actions */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="status">Update Status</Label>
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="CONTACTED">Contacted</SelectItem>
                      <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="adminNotes">Admin Notes</Label>
                  <Textarea
                    id="adminNotes"
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add notes about this request..."
                    rows={3}
                  />
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
                  onClick={handleUpdateStatus}
                  disabled={submitting}
                  className="bg-syria-gold hover:bg-syria-dark-gold"
                >
                  {submitting ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Updating...
                    </div>
                  ) : (
                    "Update Request"
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
