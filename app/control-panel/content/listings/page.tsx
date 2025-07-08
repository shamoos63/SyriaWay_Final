"use client"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"
import { Hotel, Car, Compass, User, Search, Filter, ArrowUp, ArrowDown } from "lucide-react"

const TYPE_ICONS = {
  HOTEL: Hotel,
  CAR: Car,
  TOUR: Compass
}

export default function AdminListingsPage() {
  const { user } = useAuth()
  const [listings, setListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState("createdAt")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc")

  useEffect(() => {
    fetchListings()
  }, [])

  const fetchListings = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/listings", {
        headers: { Authorization: `Bearer ${user?.id}` }
      })
      const data = await res.json()
      setListings(data.listings || [])
    } catch (e) {
      toast({ title: "Error", description: "Failed to load listings", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleToggle = async (listing: any, field: "isVerified" | "isSpecialOffer", value: boolean) => {
    try {
      const res = await fetch(`/api/admin/listings/${listing.type}/${listing.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.id}`
        },
        body: JSON.stringify({ [field]: value })
      })
      if (!res.ok) throw new Error()
      toast({ title: "Success", description: `${field === "isVerified" ? "Verification" : "Special Offer"} updated.` })
      fetchListings()
    } catch {
      toast({ title: "Error", description: `Failed to update ${field}` })
    }
  }

  // Sorting
  const sortedListings = [...listings]
    .filter(l =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.provider?.name?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      let vA = a[sortBy]
      let vB = b[sortBy]
      if (vA === undefined) vA = ""
      if (vB === undefined) vB = ""
      if (sortDir === "asc") return vA > vB ? 1 : vA < vB ? -1 : 0
      return vA < vB ? 1 : vA > vB ? -1 : 0
    })

  const renderSort = (field: string) => (
    <Button variant="ghost" size="icon" onClick={() => {
      if (sortBy === field) setSortDir(sortDir === "asc" ? "desc" : "asc")
      else { setSortBy(field); setSortDir("asc") }
    }}>
      {sortBy === field ? (sortDir === "asc" ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />) : null}
    </Button>
  )

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>All Listings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-4">
          <Input
            placeholder="Search by name or provider..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="max-w-xs"
          />
          <Button onClick={fetchListings} variant="outline"><Filter className="w-4 h-4 mr-2" />Refresh</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-2">Type</th>
                <th className="p-2">Name {renderSort("name")}</th>
                <th className="p-2">Provider</th>
                <th className="p-2">Verified {renderSort("isVerified")}</th>
                <th className="p-2">Special Offer {renderSort("isSpecialOffer")}</th>
                <th className="p-2">Created {renderSort("createdAt")}</th>
                <th className="p-2">Updated {renderSort("updatedAt")}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="text-center p-8">Loading...</td></tr>
              ) : sortedListings.length === 0 ? (
                <tr><td colSpan={7} className="text-center p-8">No listings found.</td></tr>
              ) : sortedListings.map(listing => {
                const Icon = TYPE_ICONS[listing.type] || User
                return (
                  <tr key={listing.type + listing.id} className="border-b">
                    <td className="p-2 font-bold flex items-center gap-2"><Icon className="w-4 h-4" />{listing.type}</td>
                    <td className="p-2">{listing.name}</td>
                    <td className="p-2">{listing.provider?.name || "-"} <span className="text-xs text-gray-400">{listing.provider?.email}</span></td>
                    <td className="p-2 text-center">
                      <Switch checked={!!listing.isVerified} onCheckedChange={v => handleToggle(listing, "isVerified", v)} />
                      {listing.isVerified && <Badge className="ml-2" variant="success">Verified</Badge>}
                    </td>
                    <td className="p-2 text-center">
                      <Switch checked={!!listing.isSpecialOffer} onCheckedChange={v => handleToggle(listing, "isSpecialOffer", v)} />
                      {listing.isSpecialOffer && <Badge className="ml-2" variant="warning">Special</Badge>}
                    </td>
                    <td className="p-2">{new Date(listing.createdAt).toLocaleDateString()}</td>
                    <td className="p-2">{new Date(listing.updatedAt).toLocaleDateString()}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
} 