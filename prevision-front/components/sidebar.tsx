"use client"

import { useState } from "react"
import { Users, Menu, X, GitBranch ,Settings,Calendar,CheckCircle, Archive,Clock,Eye,Tag} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"

const menuItems = [
  {
    name: "Validateurs",
    href: "/validateurs",
    icon: Users,
  },
  {
    name: "Flux de validation",
    href: "/flux-validation",
    icon: GitBranch,
  },
   {
    name: "SystemVersion",
    href: "/system-version",
    icon: Settings,
  },
   {
    name: "Tags",
    href: "/tags",
    icon: Tag,
  },
  {
    name: "Créer un prévision",
    href: "/creer-prevision",
    icon: Calendar,
  },
   {
    name: "Prévision à valider",
    href: "/prevision-validation",
    icon: CheckCircle,
  },
  {
    name: "Historique des prévisions",
    href: "/historique-previsions",
    icon: Archive,
  },
  {
    name: "État des prévisions",
    href: "/etat-previsions",
    icon: Clock,
  },
  {
    name: "Prévision reçu",
    href: "/prevision-recu",
    icon: Eye,
  },
]

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setIsOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static md:z-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Title */}
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900">Duroc Tiers</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        isActive ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <Icon className="h-5 w-5" />
                      {item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      </div>
    </>
  )
}
