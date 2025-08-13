import { toast } from "sonner"

// Export direct du toast de Sonner
export { toast }

// Hook de compatibilité si nécessaire
export const useToast = () => {
  return { toast }
}
