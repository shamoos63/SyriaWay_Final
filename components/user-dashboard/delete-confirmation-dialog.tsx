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
import { useLanguage } from "@/lib/i18n/language-context"

interface DeleteConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  title?: string
  description?: string
  entityName?: string
  entityType?: "hotel" | "car" | "flight" | "tour" | "blog"
}

export function DeleteConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  entityName,
  entityType,
}: DeleteConfirmationDialogProps) {
  const { t } = useLanguage()

  const getEntityTypeLabel = () => {
    switch (entityType) {
      case "hotel":
        return t.userDashboard?.hotel || "Hotel"
      case "car":
        return t.userDashboard?.carOwner || "Car Owner"
      case "flight":
        return t.userDashboard?.airline || "Airline"
      case "tour":
        return t.userDashboard?.tourOperator || "Tour Operator"
      case "blog":
        return "Blog Post"
      default:
        return t.userDashboard?.provider || "Provider"
    }
  }

  const defaultTitle = title || (t.userDashboard?.confirmDelete || "Confirm Delete")
  const defaultDescription = description || 
    (entityType === "blog" 
      ? "Are you sure you want to delete this blog post? This action cannot be undone."
      : `${t.userDashboard?.deleteRequestMessage || "Deleting a request should be approved by the"} ${getEntityTypeLabel()}${entityName ? ` ${entityName}` : ""}. ${t.userDashboard?.deleteRequestConfirm || "Do you want to delete the request now?"}`
    )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{defaultTitle}</DialogTitle>
          <DialogDescription>
            {defaultDescription}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-row justify-end gap-2 sm:justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t.userDashboard?.cancel || "Cancel"}
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => {
              onConfirm()
              onOpenChange(false)
            }}
          >
            {entityType === "blog" ? "Delete" : (t.userDashboard?.requestDelete || "Request Delete")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
