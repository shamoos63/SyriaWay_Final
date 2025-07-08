"use client"
import { useLanguage } from "@/lib/i18n/language-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Edit, UserPlus, Mail, Ban, CheckCircle, Loader2, Trash2 } from "lucide-react"
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

interface Customer {
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

export default function CustomersManagement() {
  const { t } = useLanguage()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("all")
  
  // Dialog states
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false)
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false)
  const [isDeleteCustomerOpen, setIsDeleteCustomerOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  
  // Form states
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: ""
  })
  const [addForm, setAddForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: ""
  })
  const [emailForm, setEmailForm] = useState({
    subject: "",
    message: ""
  })

  useEffect(() => {
    fetchCustomers()
  }, [search, status])

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      let url = `/api/admin/users?role=CUSTOMER`
      if (search) url += `&search=${encodeURIComponent(search)}`
      if (status && status !== "all") url += `&status=${status.toUpperCase()}`
      const res = await fetch(url)
      if (res.ok) {
        const data = await res.json()
        setCustomers(data.users)
      } else {
        setError("Failed to fetch customers")
      }
    } catch (e) {
      setError("Error fetching customers")
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (customerId: string, newStatus: string) => {
    try {
      setActionLoading(true)
      const response = await fetch(`/api/admin/users/${customerId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        setSuccess(`Customer ${newStatus.toLowerCase()} successfully`)
        fetchCustomers() // Refresh the list
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
    if (!selectedCustomer) return

    try {
      setActionLoading(true)
      const response = await fetch(`/api/admin/users/${selectedCustomer.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${editForm.firstName} ${editForm.lastName}`,
          email: editForm.email,
          phone: editForm.phone || undefined,
        }),
      })

      if (response.ok) {
        setSuccess("Customer updated successfully")
        setIsEditDialogOpen(false)
        setSelectedCustomer(null)
        fetchCustomers()
        setTimeout(() => setSuccess(""), 3000)
      } else {
        const data = await response.json()
        setError(data.error || "Failed to update customer")
      }
    } catch (error) {
      setError("Error updating customer")
    } finally {
      setActionLoading(false)
    }
  }

  const handleSendEmail = async () => {
    if (!selectedCustomer) return

    try {
      setActionLoading(true)
      const response = await fetch(`/api/admin/users/${selectedCustomer.id}/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailForm),
      })

      if (response.ok) {
        setSuccess("Email sent successfully")
        setIsEmailDialogOpen(false)
        setSelectedCustomer(null)
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

  const handleAddCustomer = async () => {
    try {
      setActionLoading(true)
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${addForm.firstName} ${addForm.lastName}`,
          email: addForm.email,
          password: addForm.password,
          role: 'CUSTOMER',
          phone: addForm.phone || undefined,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("Customer created successfully!")
        setIsAddCustomerOpen(false)
        setAddForm({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          phone: ""
        })
        fetchCustomers() // Refresh the list
        setTimeout(() => setSuccess(""), 3000)
      } else {
        setError(data.error || "Failed to create customer")
      }
    } catch (error) {
      setError("Error creating customer")
    } finally {
      setActionLoading(false)
    }
  }

  const handleDeleteCustomer = async () => {
    if (!selectedCustomer) return

    try {
      setActionLoading(true)
      const response = await fetch(`/api/admin/users/${selectedCustomer.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setSuccess("Customer deleted successfully!")
        setIsDeleteCustomerOpen(false)
        setSelectedCustomer(null)
        fetchCustomers() // Refresh the list
        setTimeout(() => setSuccess(""), 3000)
      } else {
        const data = await response.json()
        setError(data.error || "Failed to delete customer")
      }
    } catch (error) {
      setError("Error deleting customer")
    } finally {
      setActionLoading(false)
    }
  }

  const openEditDialog = (customer: Customer) => {
    const [firstName, ...lastNameParts] = (customer.name || "").split(" ")
    const lastName = lastNameParts.join(" ")
    
    setEditForm({
      firstName: firstName || "",
      lastName: lastName || "",
      email: customer.email,
      phone: customer.phone || ""
    })
    setSelectedCustomer(customer)
    setIsEditDialogOpen(true)
  }

  const openEmailDialog = (customer: Customer) => {
    setSelectedCustomer(customer)
    setIsEmailDialogOpen(true)
  }

  const openDeleteDialog = (customer: Customer) => {
    setSelectedCustomer(customer)
    setIsDeleteCustomerOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t.controlPanel?.customerManagement || "Customer Management"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t.controlPanel?.manageCustomerAccounts || "Manage customer accounts and permissions"}
          </p>
        </div>
        <Button onClick={() => setIsAddCustomerOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          {t.controlPanel?.addCustomer || "Add Customer"}
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
          <CardTitle>{t.controlPanel?.allCustomers || "All Customers"}</CardTitle>
          <CardDescription>
            {t.controlPanel?.viewAndManageCustomers || "View and manage all customer accounts"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder={t.controlPanel?.searchCustomers || "Search customers..."} className="pl-8" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder={t.controlPanel?.filterByStatus || "Filter by status"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.controlPanel?.allStatuses || "All Statuses"}</SelectItem>
                <SelectItem value="ACTIVE">{t.controlPanel?.active || "Active"}</SelectItem>
                <SelectItem value="INACTIVE">{t.controlPanel?.inactive || "Inactive"}</SelectItem>
                <SelectItem value="SUSPENDED">{t.controlPanel?.suspended || "Suspended"}</SelectItem>
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
                    <TableHead>{t.controlPanel?.customer || "Customer"}</TableHead>
                    <TableHead>{t.controlPanel?.email || "Email"}</TableHead>
                    <TableHead>{t.controlPanel?.joinDate || "Join Date"}</TableHead>
                    <TableHead>{t.controlPanel?.status || "Status"}</TableHead>
                    <TableHead className="text-right">{t.controlPanel?.actions || "Actions"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer, index) => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={customer.image || undefined} />
                            <AvatarFallback>{customer.name?.split(" ").map((n:any) => n[0]).join("")}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{customer.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>{new Date(customer.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          customer.status === "ACTIVE"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : customer.status === "INACTIVE"
                              ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        }`}>
                          {customer.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            title={t.controlPanel?.edit || "Edit"}
                            onClick={() => openEditDialog(customer)}
                            disabled={actionLoading}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            title={t.controlPanel?.email || "Email"}
                            onClick={() => openEmailDialog(customer)}
                            disabled={actionLoading}
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                          {customer.status === "ACTIVE" ? (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              title={t.controlPanel?.suspend || "Suspend"}
                              onClick={() => handleStatusChange(customer.id, "SUSPENDED")}
                              disabled={actionLoading}
                            >
                              {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Ban className="h-4 w-4" />}
                            </Button>
                          ) : (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              title={t.controlPanel?.activate || "Activate"}
                              onClick={() => handleStatusChange(customer.id, "ACTIVE")}
                              disabled={actionLoading}
                            >
                              {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            title="Delete"
                            onClick={() => openDeleteDialog(customer)}
                            disabled={actionLoading}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Customer Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
            <DialogDescription>
              Update customer information
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEdit} disabled={actionLoading}>
              {actionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Update Customer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Email Customer Dialog */}
      <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Send Email to {selectedCustomer?.name}</DialogTitle>
            <DialogDescription>
              Send a message to {selectedCustomer?.email}
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

      {/* Add Customer Dialog */}
      <Dialog open={isAddCustomerOpen} onOpenChange={setIsAddCustomerOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
            <DialogDescription>
              Create a new customer account
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
              <Label htmlFor="addPhone">Phone (Optional)</Label>
              <Input
                id="addPhone"
                value={addForm.phone}
                onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })}
                placeholder="+963-11-1234567"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddCustomerOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCustomer} disabled={actionLoading}>
              {actionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Add Customer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Customer Dialog */}
      <Dialog open={isDeleteCustomerOpen} onOpenChange={setIsDeleteCustomerOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Customer</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedCustomer?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteCustomerOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCustomer} disabled={actionLoading}>
              {actionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
