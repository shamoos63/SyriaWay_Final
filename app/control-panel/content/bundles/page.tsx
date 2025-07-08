"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Edit, Trash2, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface Bundle {
  id: string;
  name: string;
  description: string | null;
  duration: number;
  maxGuests: number;
  price: number;
  originalPrice: number | null;
  currency: string;
  includesHotel: boolean;
  includesCar: boolean;
  includesGuide: boolean;
  itinerary: string | null;
  inclusions: string[] | null;
  exclusions: string[] | null;
  images: string[] | null;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function BundlesPage() {
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedBundle, setSelectedBundle] = useState<Bundle | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    duration: 1,
    maxGuests: 2,
    price: 0,
    originalPrice: 0,
    currency: "USD",
    includesHotel: false,
    includesCar: false,
    includesGuide: false,
    itinerary: "",
    inclusions: "",
    exclusions: "",
    images: "",
    isActive: true,
    isFeatured: false,
  });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchBundles();
  }, []);

  const fetchBundles = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/bundles");
      const data = await res.json();
      setBundles(data.bundles);
    } catch (e) {
      setError("Failed to fetch bundles");
    } finally {
      setLoading(false);
    }
  };

  const openAddDialog = () => {
    setIsEdit(false);
    setForm({
      name: "",
      description: "",
      duration: 1,
      maxGuests: 2,
      price: 0,
      originalPrice: 0,
      currency: "USD",
      includesHotel: false,
      includesCar: false,
      includesGuide: false,
      itinerary: "",
      inclusions: "",
      exclusions: "",
      images: "",
      isActive: true,
      isFeatured: false,
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (bundle: Bundle) => {
    setIsEdit(true);
    setSelectedBundle(bundle);
    setForm({
      name: bundle.name || "",
      description: bundle.description || "",
      duration: bundle.duration,
      maxGuests: bundle.maxGuests,
      price: bundle.price,
      originalPrice: bundle.originalPrice || 0,
      currency: bundle.currency,
      includesHotel: bundle.includesHotel,
      includesCar: bundle.includesCar,
      includesGuide: bundle.includesGuide,
      itinerary: bundle.itinerary || "",
      inclusions: (bundle.inclusions || []).join(", "),
      exclusions: (bundle.exclusions || []).join(", "),
      images: (bundle.images || []).join(", "),
      isActive: bundle.isActive,
      isFeatured: bundle.isFeatured,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this bundle? This action cannot be undone.")) {
      return;
    }
    
    try {
      setActionLoading(true)
      const response = await fetch(`/api/bundles/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        setBundles(bundles.filter(bundle => bundle.id !== id))
        toast({
          title: "Success",
          description: "Bundle deleted successfully",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to delete bundle",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error deleting bundle:', error)
      toast({
        title: "Error",
        description: "Failed to delete bundle",
        variant: "destructive",
      })
    } finally {
      setActionLoading(false)
    }
  }

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      setActionLoading(true)
      const response = await fetch(`/api/bundles/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isActive: !currentStatus,
        }),
      })
      if (response.ok) {
        setBundles(bundles.map(bundle => 
          bundle.id === id 
            ? { ...bundle, isActive: !currentStatus }
            : bundle
        ))
        toast({
          title: "Success",
          description: `Bundle ${!currentStatus ? 'activated' : 'deactivated'} successfully`,
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to update bundle status",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error updating bundle status:', error)
      toast({
        title: "Error",
        description: "Failed to update bundle status",
        variant: "destructive",
      })
    } finally {
      setActionLoading(false)
    }
  }

  const handleSubmit = async () => {
    setActionLoading(true);
    try {
      const payload = {
        ...form,
        duration: Number(form.duration),
        maxGuests: Number(form.maxGuests),
        price: Number(form.price),
        originalPrice: Number(form.originalPrice),
        inclusions: form.inclusions.split(",").map((s) => s.trim()).filter(Boolean),
        exclusions: form.exclusions.split(",").map((s) => s.trim()).filter(Boolean),
        images: form.images.split(",").map((s) => s.trim()).filter(Boolean),
      };
      if (isEdit && selectedBundle) {
        await fetch(`/api/bundles/${selectedBundle.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        setSuccess("Bundle updated");
      } else {
        await fetch("/api/bundles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        setSuccess("Bundle created");
      }
      setIsDialogOpen(false);
      fetchBundles();
    } catch (e) {
      setError("Failed to save bundle");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Bundles Management</h1>
        <Button onClick={openAddDialog} className="flex items-center gap-2">
          <PlusCircle className="h-5 w-5" /> Add Bundle
        </Button>
      </div>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      {success && <div className="mb-4 text-green-600">{success}</div>}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="animate-spin h-8 w-8 text-muted-foreground" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {bundles.map((bundle) => (
            <Card key={bundle.id} className="relative">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {bundle.name}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(bundle)}
                      disabled={actionLoading}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={bundle.isActive ? "destructive" : "default"}
                      size="sm"
                      onClick={() => handleToggleStatus(bundle.id, bundle.isActive)}
                      disabled={actionLoading}
                    >
                      {bundle.isActive ? "Deactivate" : "Activate"}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(bundle.id)}
                      disabled={actionLoading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-2 text-lg font-semibold text-syria-gold">${bundle.price}</div>
                <div className="mb-2 text-sm text-muted-foreground">{bundle.description}</div>
                <div className="mb-2 text-xs">Duration: {bundle.duration} days | Max Guests: {bundle.maxGuests}</div>
                <div className="mb-2 text-xs">{bundle.includesHotel && "Hotel Included, "}{bundle.includesCar && "Car Included, "}{bundle.includesGuide && "Guide Included"}</div>
                <div className="mb-2 text-xs">Active: {bundle.isActive ? "Yes" : "No"} | Featured: {bundle.isFeatured ? "Yes" : "No"}</div>
                <div className="mb-2 text-xs">Inclusions: {(bundle.inclusions || []).join(", ")}</div>
                <div className="mb-2 text-xs">Exclusions: {(bundle.exclusions || []).join(", ")}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEdit ? "Edit Bundle" : "Add Bundle"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Bundle Name *</label>
                <Input 
                  placeholder="Enter bundle name" 
                  value={form.name} 
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Currency</label>
                <Input 
                  placeholder="USD" 
                  value={form.currency} 
                  onChange={e => setForm(f => ({ ...f, currency: e.target.value }))} 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea 
                placeholder="Enter bundle description" 
                value={form.description} 
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))} 
                rows={3}
              />
            </div>

            {/* Duration and Guests */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Duration (days) *</label>
                <Input 
                  type="number" 
                  placeholder="5" 
                  value={form.duration} 
                  onChange={e => setForm(f => ({ ...f, duration: Number(e.target.value) }))} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Maximum Guests *</label>
                <Input 
                  type="number" 
                  placeholder="4" 
                  value={form.maxGuests} 
                  onChange={e => setForm(f => ({ ...f, maxGuests: Number(e.target.value) }))} 
                />
              </div>
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Price *</label>
                <Input 
                  type="number" 
                  placeholder="299.99" 
                  value={form.price} 
                  onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Original Price (for discounts)</label>
                <Input 
                  type="number" 
                  placeholder="399.99" 
                  value={form.originalPrice} 
                  onChange={e => setForm(f => ({ ...f, originalPrice: Number(e.target.value) }))} 
                />
              </div>
            </div>

            {/* Services Included */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Services Included</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    checked={form.includesHotel} 
                    onChange={e => setForm(f => ({ ...f, includesHotel: e.target.checked }))} 
                  /> 
                  Hotel Accommodation
                </label>
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    checked={form.includesCar} 
                    onChange={e => setForm(f => ({ ...f, includesCar: e.target.checked }))} 
                  /> 
                  Car Rental
                </label>
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    checked={form.includesGuide} 
                    onChange={e => setForm(f => ({ ...f, includesGuide: e.target.checked }))} 
                  /> 
                  Tour Guide
                </label>
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Bundle Status</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    checked={form.isActive} 
                    onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} 
                  /> 
                  Active (visible to customers)
                </label>
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    checked={form.isFeatured} 
                    onChange={e => setForm(f => ({ ...f, isFeatured: e.target.checked }))} 
                  /> 
                  Featured (highlighted on homepage)
                </label>
              </div>
            </div>

            {/* Itinerary */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Itinerary</label>
              <Textarea 
                placeholder="Day 1: Arrival in Damascus, Day 2: Old City Tour..." 
                value={form.itinerary} 
                onChange={e => setForm(f => ({ ...f, itinerary: e.target.value }))} 
                rows={3}
              />
            </div>

            {/* Inclusions and Exclusions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">What's Included</label>
                <Textarea 
                  placeholder="Hotel accommodation, Daily breakfast, Airport transfers (comma separated)" 
                  value={form.inclusions} 
                  onChange={e => setForm(f => ({ ...f, inclusions: e.target.value }))} 
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">What's Not Included</label>
                <Textarea 
                  placeholder="International flights, Lunch and dinner, Personal expenses (comma separated)" 
                  value={form.exclusions} 
                  onChange={e => setForm(f => ({ ...f, exclusions: e.target.value }))} 
                  rows={4}
                />
              </div>
            </div>

            {/* Images */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Image URLs</label>
              <Textarea 
                placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg (comma separated URLs)" 
                value={form.images} 
                onChange={e => setForm(f => ({ ...f, images: e.target.value }))} 
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={actionLoading}>
              {actionLoading ? <Loader2 className="animate-spin h-4 w-4" /> : isEdit ? "Update Bundle" : "Create Bundle"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 