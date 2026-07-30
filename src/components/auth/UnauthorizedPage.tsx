import React from "react"
import { ShieldQuestion } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useNavigate } from "react-router-dom"

const UnauthorizedPage = () => {
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-warning/10 text-warning">
            <ShieldQuestion className="size-6" />
          </div>
          <CardTitle className="text-2xl">401 - Non autorisé</CardTitle>
          <CardDescription>
            Vous devez être authentifié pour accéder à cette page. Veuillez vous assurer que vous êtes connecté au réseau de l'entreprise.
          </CardDescription>
        </CardHeader>
        <CardContent />
        <CardFooter className="flex justify-center">
          <Button onClick={() => navigate("/")}>Retour à l'accueil</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default UnauthorizedPage

