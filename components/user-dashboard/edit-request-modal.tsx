"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { useLanguage } from "@/lib/i18n/language-context"

interface Request {
  id: string
  type: "hotel" | "car" | "flight" | "tour"
  title: string
  date: string
  status: string
  details: string
  price: string
}

interface EditRequestModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => void
  request: Request
}

export function EditRequestModal({ isOpen, onClose, onSave, request }: EditRequestModalProps) {
  const { t } = useLanguage()
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [endDate, setEndDate] = useState<Date | undefined>(new Date())
  const [people, setPeople] = useState("2")

  const getEditFields = () => {
    switch (request.type) {
      case "car":
        return (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="end-date">{t.userDashboard?.rentalEndDate || "Rental End Date"}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
              <p className="text-xs text-muted-foreground">
                {t.userDashboard?.carEditNote ||
                  "You can only request to change the rental end date. The car owner will need to approve this change."}
              </p>
            </div>
          </div>
        )

      case "hotel":
        return (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="check-out-date">{t.userDashboard?.checkOutDate || "Check-out Date"}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="people">{t.userDashboard?.numberOfPeople || "Number of People"}</Label>
              <Input
                id="people"
                type="number"
                min="1"
                value={people}
                onChange={(e) => setPeople(e.target.value)}
                className="w-full"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {t.userDashboard?.hotelEditNote ||
                "You can request to extend your stay or change the number of guests. The hotel will need to approve these changes."}
            </p>
          </div>
        )

      case "tour":
        return (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="tour-date">{t.userDashboard?.tourDate || "Tour Date"}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="people">{t.userDashboard?.numberOfPeople || "Number of People"}</Label>
              <Input
                id="people"
                type="number"
                min="1"
                value={people}
                onChange={(e) => setPeople(e.target.value)}
                className="w-full"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {t.userDashboard?.tourEditNote ||
                "You can request to change the tour date or the number of participants. The tour operator will need to approve these changes."}
            </p>
          </div>
        )

      case "flight":
        return (
          <div className="space-y-4 py-4">
            <p className="text-sm font-medium text-muted-foreground">
              {t.userDashboard?.flightEditNote ||
                "Flight changes are subject to airline policies and may incur additional fees. Please contact customer service for assistance."}
            </p>
          </div>
        )

      default:
        return null
    }
  }

  const handleSave = () => {
    const data = {
      id: request.id,
      type: request.type,
      date: date ? format(date, "PPP") : null,
      endDate: endDate ? format(endDate, "PPP") : null,
      people: people,
    }
    onSave(data)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {t.userDashboard?.editRequest || "Edit Request"} - {request.title}
          </DialogTitle>
          <DialogDescription>
            {t.userDashboard?.editRequestDescription ||
              "Make changes to your request. All changes will need to be approved by the service provider."}
          </DialogDescription>
        </DialogHeader>

        {getEditFields()}

        <DialogFooter className="flex flex-row justify-end gap-2 sm:justify-end">
          <Button variant="outline" onClick={onClose}>
            {t.userDashboard?.cancel || "Cancel"}
          </Button>
          <Button onClick={handleSave}>{t.userDashboard?.requestChanges || "Request Changes"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
