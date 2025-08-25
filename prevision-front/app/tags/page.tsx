"use client"

import { useState } from "react"
import { CreateTagModal } from "@/components/tag/create-tag-modal"
import { TagsList } from "@/components/tag/tag-list"

export default function TagsPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleTagCreated = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Tags</h1>
          <p className="text-gray-600 mt-2">Créez et gérez les tags utilisés dans les remarques des validateurs</p>
        </div>
        <CreateTagModal onTagCreated={handleTagCreated} />
      </div>

      <TagsList refreshTrigger={refreshTrigger} />
    </div>
  )
}
