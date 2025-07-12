"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Search, Eye, MessageSquare, Trash2, Mail, Clock, Phone } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface ContactForm {
  id: string
  name: string
  email: string
  phone: string | null
  subject: string
  message: string
  category: string | null
  priority: string
  status: string
  assignedTo: string | null
  response: string | null
  respondedAt: string | null
  respondedBy: string | null
  createdAt: string
  updatedAt: string
  user: {
    id: string
    name: string | null
    email: string
  } | null
}

export default function ContactFormsPage() {
  const [contactForms, setContactForms] = useState<ContactForm[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [priorityFilter, setPriorityFilter] = useState("")
  const [selectedForm, setSelectedForm] = useState<ContactForm | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false)
  const [responseText, setResponseText] = useState("")
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    fetchContactForms()
  }, [])

  const fetchContactForms = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchTerm) params.append("search", searchTerm)
      if (statusFilter && statusFilter !== "all") params.append("status", statusFilter)
      if (priorityFilter && priorityFilter !== "all") params.append("priority", priorityFilter)

      const response = await fetch(`/api/admin/contact-forms?${params}`)
      if (response.ok) {
        const data = await response.json()
        setContactForms(data.contactForms)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch contact forms",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching contact forms:", error)
      toast({
        title: "Error",
        description: "Failed to fetch contact forms",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleViewForm = (form: ContactForm) => {
    setSelectedForm(form)
    setIsViewDialogOpen(true)
  }

  const handleRespond = (form: ContactForm) => {
    setSelectedForm(form)
    setResponseText(form.response || "")
    setIsResponseDialogOpen(true)
  }

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      setActionLoading(true)
      const response = await fetch(`/api/admin/contact-forms/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        setContactForms(prev => 
          prev.map(form => 
            form.id === id ? { ...form, status } : form
          )
        )
        toast({
          title: "Success",
          description: "Status updated successfully",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to update status",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating status:", error)
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      })
    } finally {
      setActionLoading(false)
    }
  }

  const handleSubmitResponse = async () => {
    if (!selectedForm || !responseText.trim()) return

    try {
      setActionLoading(true)
      const response = await fetch(`/api/admin/contact-forms/${selectedForm.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          response: responseText,
          status: "Resolved"
        }),
      })

      if (response.ok) {
        setContactForms(prev => 
          prev.map(form => 
            form.id === selectedForm.id 
              ? { ...form, response: responseText, status: "Resolved" }
              : form
          )
        )
        setIsResponseDialogOpen(false)
        setResponseText("")
        toast({
          title: "Success",
          description: "Response sent successfully",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to send response",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error sending response:", error)
      toast({
        title: "Error",
        description: "Failed to send response",
        variant: "destructive",
      })
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this contact form? This action cannot be undone.")) {
      return
    }

    try {
      setActionLoading(true)
      const response = await fetch(`/api/admin/contact-forms/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setContactForms(prev => prev.filter(form => form.id !== id))
        toast({
          title: "Success",
          description: "Contact form deleted successfully",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to delete contact form",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting contact form:", error)
      toast({
        title: "Error",
        description: "Failed to delete contact form",
        variant: "destructive",
      })
    } finally {
      setActionLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New": return "bg-blue-100 text-blue-800"
      case "In Progress": return "bg-yellow-100 text-yellow-800"
      case "Resolved": return "bg-green-100 text-green-800"
      case "Closed": return "bg-gray-100 text-gray-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Low": return "bg-gray-100 text-gray-800"
      case "Normal": return "bg-blue-100 text-blue-800"
      case "High": return "bg-orange-100 text-orange-800"
      case "Urgent": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Contact Forms Management</h1>
        <Button onClick={fetchContactForms} disabled={loading} className="flex items-center gap-2 w-full sm:w-auto">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="sm:col-span-2 flex gap-2">
          <Input
            placeholder="Search by name, email, or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && fetchContactForms()}
            className="flex-1"
          />
          <Button onClick={fetchContactForms} disabled={loading} size="sm">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          </Button>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="New">New</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Resolved">Resolved</SelectItem>
            <SelectItem value="Closed">Closed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
            <SelectItem value="Normal">Normal</SelectItem>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Urgent">Urgent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Contact Forms List */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="animate-spin h-8 w-8 text-muted-foreground" />
        </div>
      ) : contactForms.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No contact forms found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {contactForms.map((form) => (
            <Card key={form.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg break-words">{form.name}</h3>
                      <Badge className={getStatusColor(form.status)}>{form.status}</Badge>
                      <Badge className={getPriorityColor(form.priority)}>{form.priority}</Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-2">
                      <div className="flex items-center gap-1 min-w-0">
                        <Mail className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{form.email}</span>
                      </div>
                      {form.phone && (
                        <div className="flex items-center gap-1 min-w-0">
                          <Phone className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">{form.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1 min-w-0">
                        <Clock className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{formatDate(form.createdAt)}</span>
                      </div>
                    </div>
                    <p className="font-medium mb-1 break-words">{form.subject}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2 break-words">{form.message}</p>
                    {form.response && (
                      <div className="mt-2 p-2 bg-green-50 rounded text-sm break-words">
                        <strong>Response:</strong> {form.response}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 lg:flex-col lg:items-end lg:ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewForm(form)}
                      disabled={actionLoading}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRespond(form)}
                      disabled={actionLoading || form.status === "Resolved"}
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Select
                      value={form.status}
                      onValueChange={(value) => handleUpdateStatus(form.id, value)}
                      disabled={actionLoading}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="New">New</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Resolved">Resolved</SelectItem>
                        <SelectItem value="Closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(form.id)}
                      disabled={actionLoading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Contact Form Details</DialogTitle>
          </DialogHeader>
          {selectedForm && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <p className="text-sm">{selectedForm.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <p className="text-sm">{selectedForm.email}</p>
                </div>
                {selectedForm.phone && (
                  <div>
                    <label className="text-sm font-medium">Phone</label>
                    <p className="text-sm">{selectedForm.phone}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <p className="text-sm">{selectedForm.category || "General"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Priority</label>
                  <Badge className={getPriorityColor(selectedForm.priority)}>
                    {selectedForm.priority}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <Badge className={getStatusColor(selectedForm.status)}>
                    {selectedForm.status}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Subject</label>
                <p className="text-sm font-medium">{selectedForm.subject}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Message</label>
                <p className="text-sm whitespace-pre-wrap">{selectedForm.message}</p>
              </div>
              {selectedForm.response && (
                <div>
                  <label className="text-sm font-medium">Response</label>
                  <p className="text-sm bg-green-50 p-2 rounded whitespace-pre-wrap">
                    {selectedForm.response}
                  </p>
                  {selectedForm.respondedAt && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Responded on {formatDate(selectedForm.respondedAt)}
                    </p>
                  )}
                </div>
              )}
              <div className="text-xs text-muted-foreground">
                Submitted on {formatDate(selectedForm.createdAt)}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Response Dialog */}
      <Dialog open={isResponseDialogOpen} onOpenChange={setIsResponseDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Send Response</DialogTitle>
          </DialogHeader>
          {selectedForm && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">To: {selectedForm.name} ({selectedForm.email})</label>
              </div>
              <div>
                <label className="text-sm font-medium">Subject: Re: {selectedForm.subject}</label>
              </div>
              <div>
                <label className="text-sm font-medium">Response</label>
                <Textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Type your response here..."
                  rows={6}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResponseDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitResponse} disabled={actionLoading || !responseText.trim()}>
              {actionLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Response"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 