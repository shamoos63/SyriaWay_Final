"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Loader2, Calendar, Users, DollarSign, MapPin, FileText } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface SpecialTourRequest {
  id: string
  userId: string
  assignedGuideId?: string
  title: string
  description: string
  preferredDates?: string
  numberOfPeople: number
  budget?: number
  currency?: string
  destinations?: string
  specialRequirements?: string
  status: string
  response?: string
  respondedAt?: string
  createdAt: string
  updatedAt: string
  user?: {
    id: string
    name: string
    email: string
    phone?: string
  }
  guide?: {
    id: string
    name: string
    email: string
  }
}

interface SpecialTourRequestModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  request: SpecialTourRequest | null
  onSave: (formData: any) => Promise<void>
  loading?: boolean
  mode?: 'view' | 'edit'
}

export function SpecialTourRequestModal({
  open,
  onOpenChange,
  request,
  onSave,
  loading = false,
  mode = 'edit'
}: SpecialTourRequestModalProps) {
  const [formData, setFormData] = useState({
    status: "",
    assignedGuideId: "",
    response: "",
    specialRequirements: ""
  })
  const [guides, setGuides] = useState<Array<{ id: string; name: string; email: string }>>([])
  const [guidesLoading, setGuidesLoading] = useState(false)

  useEffect(() => {
    if (request) {
      setFormData({
        status: request.status || "PENDING",
        assignedGuideId: request.assignedGuideId || "",
        response: request.response || "",
        specialRequirements: request.specialRequirements || ""
      })
    }
  }, [request])

  useEffect(() => {
    if (open) {
      fetchGuides()
    }
  }, [open])

  const fetchGuides = async () => {
    try {
      setGuidesLoading(true)
      const response = await fetch("/api/guides")
      if (response.ok) {
        const data = await response.json()
        setGuides(data.guides || [])
      }
    } catch (error) {
      console.error("Error fetching guides:", error)
    } finally {
      setGuidesLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!request) return

    try {
      await onSave({
        id: request.id,
        ...formData
      })
    } catch (error) {
      console.error("Error saving request:", error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(amount)
  }

  const getStatusBadge = (status: string) => {
    const statusColors = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'IN_PROGRESS': 'bg-blue-100 text-blue-800',
      'ACCEPTED': 'bg-green-100 text-green-800',
      'REJECTED': 'bg-red-100 text-red-800',
      'COMPLETED': 'bg-gray-100 text-gray-800'
    }
    return (
      <Badge className={statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}>
        {status}
      </Badge>
    )
  }

  if (!request) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {mode === 'view' ? 'View Special Tour Request' : 'Edit Special Tour Request'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Request Details Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Request Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Tour Type</Label>
                <Input value={request.title} disabled className="mt-1" />
              </div>
              
              <div>
                <Label className="text-sm font-medium">Status</Label>
                <div className="mt-1">
                  {getStatusBadge(request.status)}
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Customer</Label>
                <Input 
                  value={request.user ? `${request.user.name} (${request.user.email})` : 'Unknown'} 
                  disabled 
                  className="mt-1" 
                />
              </div>
              
              {request.user?.phone && (
                <div>
                  <Label className="text-sm font-medium">Customer Phone</Label>
                  <Input 
                    value={request.user.phone} 
                    disabled 
                    className="mt-1" 
                  />
                </div>
              )}
              
              <div>
                <Label className="text-sm font-medium">Preferred Dates</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>{request.preferredDates ? formatDate(request.preferredDates) : 'Not specified'}</span>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Group Size</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span>{request.numberOfPeople} people</span>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Budget</Label>
                <div className="flex items-center gap-2 mt-1">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <span>
                    {request.budget 
                      ? formatCurrency(request.budget, request.currency || 'USD')
                      : 'Not specified'
                    }
                  </span>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Destinations</Label>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{request.destinations || 'Not specified'}</span>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Created</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>{formatDate(request.createdAt)}</span>
                </div>
              </div>
            </div>
            
            <div>
              <Label className="text-sm font-medium">Description</Label>
              <Textarea 
                value={request.description} 
                disabled 
                className="mt-1" 
                rows={3}
              />
            </div>
            
            {request.specialRequirements && (
              <div>
                <Label className="text-sm font-medium">Special Requirements</Label>
                <Textarea 
                  value={request.specialRequirements} 
                  disabled 
                  className="mt-1" 
                  rows={2}
                />
              </div>
            )}
          </div>

          {/* Admin Actions Section */}
          {mode === 'edit' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Admin Actions</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status" className="text-sm font-medium">Update Status</Label>
                  <Select 
                    value={formData.status || "PENDING"} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                      <SelectItem value="ACCEPTED">Accepted</SelectItem>
                      <SelectItem value="REJECTED">Rejected</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="assignedGuideId" className="text-sm font-medium">Assign Guide</Label>
                  <Select 
                    value={formData.assignedGuideId || "none"} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, assignedGuideId: value === "none" ? "" : value }))}
                    disabled={guidesLoading}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder={guidesLoading ? "Loading guides..." : "Select guide"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No guide assigned</SelectItem>
                      {guides.map((guide) => (
                        <SelectItem key={guide.id} value={guide.id}>
                          {guide.name} ({guide.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="response" className="text-sm font-medium">Admin Response</Label>
                <Textarea 
                  id="response"
                  value={formData.response}
                  onChange={(e) => setFormData(prev => ({ ...prev, response: e.target.value }))}
                  placeholder="Enter your response to the customer..."
                  className="mt-1"
                  rows={4}
                />
              </div>
              
              <div>
                <Label htmlFor="specialRequirements" className="text-sm font-medium">Update Special Requirements</Label>
                <Textarea 
                  id="specialRequirements"
                  value={formData.specialRequirements}
                  onChange={(e) => setFormData(prev => ({ ...prev, specialRequirements: e.target.value }))}
                  placeholder="Update special requirements or add notes..."
                  className="mt-1"
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* Current Assignment */}
          {request.guide && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Currently Assigned Guide</h4>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="font-medium">{request.guide.name}</div>
                <div className="text-sm text-gray-600">{request.guide.email}</div>
              </div>
            </div>
          )}

          {/* Previous Response */}
          {request.response && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Previous Response</h4>
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-sm">{request.response}</div>
                {request.respondedAt && (
                  <div className="text-xs text-gray-500 mt-1">
                    Responded on {formatDate(request.respondedAt)}
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              {mode === 'view' ? 'Close' : 'Cancel'}
            </Button>
            {mode === 'edit' && (
              <Button 
                type="submit" 
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 