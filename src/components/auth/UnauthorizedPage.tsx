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
          <CardTitle className="text-2xl">401 - Unauthorized</CardTitle>
          <CardDescription>
            You must be authenticated to access this page. Please ensure you are connected to the corporate network.
          </CardDescription>
        </CardHeader>
        <CardContent />
        <CardFooter className="flex justify-center">
          <Button onClick={() => navigate("/")}>Go back home</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default UnauthorizedPage

