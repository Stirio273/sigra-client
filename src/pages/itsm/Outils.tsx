import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ApplicationsTab from "@/pages/itsm/outils/ApplicationsTab";
import ClassesServiceTab from "@/pages/itsm/outils/ClassesServiceTab";
import JourFeriesTab from "@/pages/itsm/outils/JourFeriesTab";
import TopBar from "@/components/itsm/TopBar";

export default function Outils() {
  const [activeTab, setActiveTab] = useState<string>("applications");

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-full mx-auto">
        <TopBar />
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-medium">Configuration</h1>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList variant="line">
              <TabsTrigger value="applications">Applications</TabsTrigger>
              <TabsTrigger value="classes-service">
                Classes de service
              </TabsTrigger>
              <TabsTrigger value="jours-feries">Jours fériés</TabsTrigger>
            </TabsList>
            <TabsContent value="applications" className="mt-4">
              <ApplicationsTab />
            </TabsContent>
            <TabsContent value="classes-service" className="mt-4">
              <ClassesServiceTab />
            </TabsContent>
            <TabsContent value="jours-feries" className="mt-4">
              <JourFeriesTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
