import React from "react"
import { ShieldX } from "lucide-react"
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

const ForbiddenPage = () => {
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <ShieldX className="size-6" />
          </div>
          <CardTitle className="text-2xl">403 - Forbidden</CardTitle>
          <CardDescription>
            You do not have the required permissions to access this page. Please contact your administrator.
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

export default ForbiddenPage

