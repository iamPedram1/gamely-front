"use client"

import { useTranslation } from "react-i18next"
import { Languages } from "lucide-react"

// Components
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function LanguageSwitcher() {
  // Custom Hooks
  const { i18n } = useTranslation()

  // Custom Utilities
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
    document.documentElement.lang = lng
    document.documentElement.dir = lng === "fa" ? "rtl" : "ltr"
  }

  // Render
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-primary/10">
          <Languages className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => changeLanguage("en")}>English</DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage("fa")}>فارسی</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
