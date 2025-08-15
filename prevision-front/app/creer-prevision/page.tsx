import PrevisionForm from "@/components/prevision/prevision-form"

export default function PrevisionPage() {
  return (
    <div className="flex-1 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Créer une Prévision</h1>
        <PrevisionForm />
      </div>
    </div>
  )
}
