import ValidateursList from "@/components/Validateurs/validateurs-list"

export default function ValidateursPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Validateurs</h1>
        <p className="text-gray-600 mt-2">Gérez les validateurs de votre système</p>
      </div>

      <ValidateursList />
    </div>
  )
}
