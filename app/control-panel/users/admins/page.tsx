"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/i18n/language-context"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, Search, Edit, Trash2, Shield, User, Loader2, Mail, Ban, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import dayjs from 'dayjs'

interface AdminUser {
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

export default function AdminsPage() {
  const { t } = useLanguage()
  const { user: currentUser } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false)
  const [isEditAdminOpen, setIsEditAdminOpen] = useState(false)
  const [isDeleteAdminOpen, setIsDeleteAdminOpen] = useState(false)
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false)
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null)
  const [admins, setAdmins] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [actionLoading, setActionLoading] = useState(false)

  // Check if current user is super admin
  const isSuperAdmin = currentUser?.role === "SUPER_ADMIN"

  // Form states for adding/editing
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "ADMIN",
    phone: ""
  })
  const [emailForm, setEmailForm] = useState({
    subject: "",
    message: ""
  })

  useEffect(() => {
    fetchAdmins()
  }, [])

  const fetchAdmins = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/users?role=ADMIN&role=SUPER_ADMIN')
      if (response.ok) {
        const data = await response.json()
        setAdmins(data.users)
      } else {
        setError("Failed to fetch administrators")
      }
    } catch (error) {
      setError("Error fetching administrators")
    } finally {
      setLoading(false)
    }
  }

  const handleAddAdmin = async () => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          phone: formData.phone || undefined,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("Administrator created successfully!")
        setIsAddAdminOpen(false)
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          role: "ADMIN",
          phone: ""
        })
        fetchAdmins() // Refresh the list
        setTimeout(() => setSuccess(""), 3000)
      } else {
        setError(data.error || "Failed to create administrator")
      }
    } catch (error) {
      setError("Error creating administrator")
    }
  }

  const handleEditAdmin = async () => {
    if (!selectedAdmin) return

    try {
      const response = await fetch(`/api/admin/users/${selectedAdmin.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          role: formData.role,
          phone: formData.phone || undefined,
          ...(formData.password && { password: formData.password }),
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("Administrator updated successfully!")
        setIsEditAdminOpen(false)
        setSelectedAdmin(null)
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          role: "ADMIN",
          phone: ""
        })
        fetchAdmins() // Refresh the list
        setTimeout(() => setSuccess(""), 3000)
      } else {
        setError(data.error || "Failed to update administrator")
      }
    } catch (error) {
      setError("Error updating administrator")
    }
  }

  const handleDeleteAdmin = async () => {
    if (!selectedAdmin) return

    try {
      const response = await fetch(`/api/admin/users/${selectedAdmin.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setSuccess("Administrator deleted successfully!")
        setIsDeleteAdminOpen(false)
        setSelectedAdmin(null)
        fetchAdmins() // Refresh the list
        setTimeout(() => setSuccess(""), 3000)
      } else {
        const data = await response.json()
        setError(data.error || "Failed to delete administrator")
      }
    } catch (error) {
      setError("Error deleting administrator")
    }
  }

  const handleStatusChange = async (adminId: string, newStatus: string) => {
    try {
      setActionLoading(true)
      const response = await fetch(`/api/admin/users/${adminId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        setSuccess(`Administrator ${newStatus.toLowerCase()} successfully`)
        fetchAdmins() // Refresh the list
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

  const handleSendEmail = async () => {
    if (!selectedAdmin) return

    try {
      setActionLoading(true)
      const response = await fetch(`/api/admin/users/${selectedAdmin.id}/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailForm),
      })

      if (response.ok) {
        setSuccess("Email sent successfully")
        setIsEmailDialogOpen(false)
        setSelectedAdmin(null)
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

  const openEditDialog = (admin: AdminUser) => {
    const [firstName, ...lastNameParts] = (admin.name || "").split(" ")
    const lastName = lastNameParts.join(" ")
    
    setFormData({
      firstName: firstName || "",
      lastName: lastName || "",
      email: admin.email,
      password: "",
      role: admin.role,
      phone: admin.phone || ""
    })
    setSelectedAdmin(admin)
    setIsEditAdminOpen(true)
  }

  const openDeleteDialog = (admin: AdminUser) => {
    setSelectedAdmin(admin)
    setIsDeleteAdminOpen(true)
  }

  const openEmailDialog = (admin: AdminUser) => {
    setSelectedAdmin(admin)
    setIsEmailDialogOpen(true)
  }

  const filteredAdmins = admins.filter(
    (admin) =>
      (admin.name?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
      admin.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.role.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    const d = dayjs(dateString)
    return d.isValid() ? d.format('YYYY-MM-DD HH:mm') : 'Never';
  }

  const getUserInitials = (name: string | null) => {
    if (!name) return "U"
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading administrators...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Administrators</h1>
          <p className="text-muted-foreground">
            Manage administrator accounts and permissions
          </p>
        </div>
        <Button onClick={() => setIsAddAdminOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Administrator
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

      <div className="flex items-center gap-2 mb-6">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search administrators..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Administrator List</CardTitle>
          <CardDescription>
            Total: {admins.length} administrators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-3 px-2 text-left font-medium">Administrator</th>
                  <th className="py-3 px-2 text-left font-medium">Role</th>
                  <th className="py-3 px-2 text-left font-medium">Status</th>
                  <th className="py-3 px-2 text-left font-medium">Last Login</th>
                  <th className="py-3 px-2 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAdmins.map((admin) => (
                  <tr key={admin.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={admin.image || undefined} alt={admin.name || "User"} />
                          <AvatarFallback>{getUserInitials(admin.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{admin.name || "No name"}</div>
                          <div className="text-xs text-muted-foreground">{admin.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <span>{admin.role.replace('_', ' ')}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <Badge variant={admin.status === "ACTIVE" ? "default" : "secondary"}>
                        {admin.status === "ACTIVE" ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="py-3 px-2 text-muted-foreground">
                      {formatDate(admin.lastLoginAt)}
                    </td>
                    <td className="py-3 px-2 text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => openEditDialog(admin)}
                          disabled={actionLoading}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => openEmailDialog(admin)}
                          disabled={actionLoading}
                        >
                          <Mail className="h-4 w-4" />
                          <span className="sr-only">Email</span>
                        </Button>
                        {admin.status === "ACTIVE" ? (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleStatusChange(admin.id, "SUSPENDED")}
                            disabled={actionLoading || (!isSuperAdmin && admin.role === 'SUPER_ADMIN')}
                          >
                            {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Ban className="h-4 w-4" />}
                            <span className="sr-only">Suspend</span>
                          </Button>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleStatusChange(admin.id, "ACTIVE")}
                            disabled={actionLoading}
                          >
                            {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                            <span className="sr-only">Activate</span>
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => openDeleteDialog(admin)}
                          disabled={(!isSuperAdmin && admin.role === 'SUPER_ADMIN') || actionLoading}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add Administrator Dialog */}
      <Dialog open={isAddAdminOpen} onOpenChange={setIsAddAdminOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Add New Administrator</DialogTitle>
            <DialogDescription>
              Create a new administrator account with specific permissions
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input 
                  id="firstName" 
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input 
                  id="lastName" 
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </div>
                </div>
                <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="john.doe@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
                </div>
                  <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
                  </div>
                  <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select 
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {isSuperAdmin && <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>}
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
                  </div>
                  <div className="space-y-2">
              <Label htmlFor="phone">Phone (Optional)</Label>
              <Input 
                id="phone" 
                placeholder="+963-11-1234567"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
                </div>
              </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddAdminOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddAdmin}>
              Add Administrator
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Administrator Dialog */}
      <Dialog open={isEditAdminOpen} onOpenChange={setIsEditAdminOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Edit Administrator</DialogTitle>
            <DialogDescription>
              Update administrator account information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                <Label htmlFor="editFirstName">First Name</Label>
                <Input 
                  id="editFirstName" 
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
                  </div>
                  <div className="space-y-2">
                <Label htmlFor="editLastName">Last Name</Label>
                <Input 
                  id="editLastName" 
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
                  </div>
                </div>
                <div className="space-y-2">
              <Label htmlFor="editEmail">Email</Label>
              <Input 
                id="editEmail" 
                type="email" 
                placeholder="john.doe@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
                </div>
                <div className="space-y-2">
              <Label htmlFor="editPassword">New Password (leave blank to keep current)</Label>
              <Input 
                id="editPassword" 
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
                </div>
                <div className="space-y-2">
              <Label htmlFor="editRole">Role</Label>
              <Select 
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value })}
              >
                    <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                  {isSuperAdmin && <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>}
                  <SelectItem value="ADMIN">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
              <Label htmlFor="editPhone">Phone (Optional)</Label>
              <Input 
                id="editPhone" 
                placeholder="+963-11-1234567"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
                  </div>
                </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditAdminOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditAdmin}>
              Update Administrator
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Administrator Dialog */}
      <Dialog open={isDeleteAdminOpen} onOpenChange={setIsDeleteAdminOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Administrator</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this administrator? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteAdminOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteAdmin}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Email Administrator Dialog */}
      <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Send Email to {selectedAdmin?.name}</DialogTitle>
            <DialogDescription>
              Send a message to {selectedAdmin?.email}
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
    </div>
  )
}
