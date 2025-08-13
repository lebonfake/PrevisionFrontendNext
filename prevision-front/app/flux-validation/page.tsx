import FluxList from "./../../components/Flux/flux-list"

export default function FluxValidationPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Flux de validation</h1>
        <p className="text-gray-600 mt-1">Gérez les flux de validation et leurs étapes</p>
      </div>

      <FluxList />
    </div>
  )
}
