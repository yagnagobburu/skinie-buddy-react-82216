import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Sun, Moon, RefreshCw } from "lucide-react";
import RoutineStep from "@/components/RoutineStep";
import Navigation from "@/components/Navigation";
import FloatingChatButton from "@/components/FloatingChatButton";
import { Card } from "@/components/ui/card";

const Routines = () => {
  const [morningCompleted, setMorningCompleted] = useState([false, false, false, false, false]);
  const [nightCompleted, setNightCompleted] = useState([false, false, false, false, false, false]);

  const morningRoutine = [
    { product: "Gentle Foam Cleanser", brand: "CeraVe", instruction: "Apply to damp face, massage gently, rinse thoroughly" },
    { product: "Hyaluronic Acid", brand: "The Ordinary", instruction: "Apply 2-3 drops to damp skin" },
    { product: "Niacinamide Serum", brand: "The Ordinary", instruction: "Apply 4-5 drops, avoiding eye area" },
    { product: "Eye Cream", brand: "CeraVe", instruction: "Pat gently around eye area" },
    { product: "Daily Moisturizer SPF 30", brand: "CeraVe", instruction: "Apply generously as final step" },
  ];

  const nightRoutine = [
    { product: "Gentle Foam Cleanser", brand: "CeraVe", instruction: "Apply to damp face, massage gently, rinse thoroughly" },
    { product: "Exfoliating Toner", brand: "The Ordinary", instruction: "Apply with cotton pad, avoid eye area" },
    { product: "Hyaluronic Acid", brand: "The Ordinary", instruction: "Apply 2-3 drops to damp skin" },
    { product: "Retinol 0.5%", brand: "The Ordinary", instruction: "Apply pea-sized amount (start 2-3x per week)" },
    { product: "Eye Cream", brand: "CeraVe", instruction: "Pat gently around eye area" },
    { product: "Night Moisturizer", brand: "CeraVe", instruction: "Apply generously as final step" },
  ];

  const toggleMorningStep = (index: number) => {
    const newCompleted = [...morningCompleted];
    newCompleted[index] = !newCompleted[index];
    setMorningCompleted(newCompleted);
  };

  const toggleNightStep = (index: number) => {
    const newCompleted = [...nightCompleted];
    newCompleted[index] = !newCompleted[index];
    setNightCompleted(newCompleted);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle pb-20">
      <div className="max-w-screen-lg mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Your Routines</h1>
          <p className="text-muted-foreground">AI-generated personalized skincare steps</p>
        </div>

        {/* Compatibility Notice */}
        <Card className="p-4 mb-6 bg-warning/10 border-warning">
          <p className="text-sm text-foreground">
            <span className="font-semibold">Notice:</span> Retinol and Niacinamide may cause irritation when used together. Consider using them at different times.
          </p>
        </Card>

        {/* Regenerate Banner */}
        <Card className="p-4 mb-6 bg-gradient-primary border-0 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <RefreshCw className="w-5 h-5 text-primary-foreground" />
            <p className="text-sm text-primary-foreground">
              Products updated? Regenerate your routines with AI
            </p>
          </div>
          <Button size="sm" variant="secondary" className="bg-white/20 text-primary-foreground border-0 hover:bg-white/30">
            Regenerate
          </Button>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="morning" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="morning" className="flex items-center gap-2">
              <Sun className="w-4 h-4" />
              Morning
            </TabsTrigger>
            <TabsTrigger value="night" className="flex items-center gap-2">
              <Moon className="w-4 h-4" />
              Night
            </TabsTrigger>
          </TabsList>

          <TabsContent value="morning" className="space-y-4">
            {morningRoutine.map((step, index) => (
              <RoutineStep
                key={index}
                stepNumber={index + 1}
                product={step.product}
                brand={step.brand}
                instruction={step.instruction}
                completed={morningCompleted[index]}
                onToggle={() => toggleMorningStep(index)}
              />
            ))}
          </TabsContent>

          <TabsContent value="night" className="space-y-4">
            {nightRoutine.map((step, index) => (
              <RoutineStep
                key={index}
                stepNumber={index + 1}
                product={step.product}
                brand={step.brand}
                instruction={step.instruction}
                completed={nightCompleted[index]}
                onToggle={() => toggleNightStep(index)}
              />
            ))}
          </TabsContent>
        </Tabs>
      </div>

      <FloatingChatButton />
      <Navigation />
    </div>
  );
};

export default Routines;
