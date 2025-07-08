import Link from "next/link"
import type { LucideIcon } from "lucide-react"

interface ServiceIconProps {
  icon: LucideIcon
  label: string
  href: string
}

export function ServiceIcon({ icon: Icon, label, href }: ServiceIconProps) {
  return (
    <Link href={href} className="flex flex-col items-center group">
      <div className="w-16 h-16 rounded-full bg-syria-sand flex items-center justify-center mb-2 transition-all duration-300 group-hover:bg-syria-teal dark:bg-dark-icon-bg dark:group-hover:bg-syria-teal">
        <Icon className="h-8 w-8 text-syria-teal group-hover:text-white transition-colors duration-300 dark:text-syria-teal" />
      </div>
      <span className="text-sm font-medium text-gray-700 group-hover:text-syria-teal transition-colors duration-300 dark:text-gray-300 dark:group-hover:text-syria-teal">
        {label}
      </span>
    </Link>
  )
}
