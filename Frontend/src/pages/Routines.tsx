import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Sun, Moon, RefreshCw } from "lucide-react";
import RoutineStep from "@/components/RoutineStep";
import Navigation from "@/components/Navigation";
import FloatingChatButton from "@/components/FloatingChatButton";
import TopNav from "@/components/TopNav";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { routinesAPI } from "@/services/api";

const Routines = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("morning");

  // Fetch routines from API
  const { data: routinesData, isLoading } = useQuery({
    queryKey: ['routines'],
    queryFn: async () => {
      const response = await routinesAPI.getAll();
      return response.data?.routines || [];
    }
  });

  // Generate AI routine mutation
  const generateMutation = useMutation({
    mutationFn: (type: 'morning' | 'night') => routinesAPI.generateAI(type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routines'] });
      toast.success("Routine regenerated successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to generate routine");
    }
  });

  // Complete routine mutation
  const completeMutation = useMutation({
    mutationFn: (id: string) => routinesAPI.complete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routines'] });
      queryClient.invalidateQueries({ queryKey: ['auth'] }); // Update streak
      toast.success("Routine completed! Great job! 🎉");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to complete routine");
    }
  });

  const routines = routinesData || [];
  const morningRoutine = routines.find((r: any) => r.type === 'morning');
  const nightRoutine = routines.find((r: any) => r.type === 'night');

  const [morningCompleted, setMorningCompleted] = useState<boolean[]>([]);
  const [nightCompleted, setNightCompleted] = useState<boolean[]>([]);

  // Initialize completion arrays when routines load
  useEffect(() => {
    if (morningRoutine) {
      setMorningCompleted(new Array(morningRoutine.steps.length).fill(false));
    }
  }, [morningRoutine]);

  useEffect(() => {
    if (nightRoutine) {
      setNightCompleted(new Array(nightRoutine.steps.length).fill(false));
    }
  }, [nightRoutine]);

  // Check if all morning steps completed and trigger API
  useEffect(() => {
    if (morningCompleted.length > 0 && morningCompleted.every(c => c) && morningRoutine) {
      completeMutation.mutate(morningRoutine._id);
      // Reset after completion
      setTimeout(() => {
        setMorningCompleted(new Array(morningRoutine.steps.length).fill(false));
      }, 1000);
    }
  }, [morningCompleted]);

  // Check if all night steps completed and trigger API
  useEffect(() => {
    if (nightCompleted.length > 0 && nightCompleted.every(c => c) && nightRoutine) {
      completeMutation.mutate(nightRoutine._id);
      // Reset after completion
      setTimeout(() => {
        setNightCompleted(new Array(nightRoutine.steps.length).fill(false));
      }, 1000);
    }
  }, [nightCompleted]);

  const handleRegenerate = () => {
    const type = activeTab as 'morning' | 'night';
    if (window.confirm(`Regenerate your ${type} routine with AI?`)) {
      generateMutation.mutate(type);
    }
  };

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
    <div className="min-h-screen bg-gradient-subtle pb-20 pt-16">
      <TopNav />
      <div className="max-w-screen-lg mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Your Routines</h1>
          <p className="text-muted-foreground">AI-generated personalized skincare steps</p>
        </div>

        {/* Compatibility Notice */}
        {(morningRoutine?.compatibilityWarnings?.length > 0 || nightRoutine?.compatibilityWarnings?.length > 0) && (
          <Card className="p-4 mb-6 bg-warning/10 border-warning">
            <p className="text-sm text-foreground">
              <span className="font-semibold">Notice:</span>{' '}
              {morningRoutine?.compatibilityWarnings?.[0] || nightRoutine?.compatibilityWarnings?.[0]}
            </p>
          </Card>
        )}

        {/* Regenerate Banner */}
        <Card className="p-4 mb-6 bg-gradient-primary border-0 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <RefreshCw className="w-5 h-5 text-primary-foreground" />
            <p className="text-sm text-primary-foreground">
              Products updated? Regenerate your routines with AI
            </p>
          </div>
          <Button 
            size="sm" 
            variant="secondary" 
            className="bg-white/20 text-primary-foreground border-0 hover:bg-white/30"
            onClick={handleRegenerate}
            disabled={generateMutation.isPending}
          >
            {generateMutation.isPending ? "Generating..." : "Regenerate"}
          </Button>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
            {isLoading ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading routine...</p>
              </div>
            ) : !morningRoutine ? (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground mb-4">No morning routine yet</p>
                <Button 
                  onClick={() => generateMutation.mutate('morning')}
                  disabled={generateMutation.isPending}
                >
                  {generateMutation.isPending ? "Generating..." : "Generate Morning Routine"}
                </Button>
              </Card>
            ) : (
              morningRoutine.steps.map((step: any, index: number) => (
                <RoutineStep
                  key={index}
                  stepNumber={step.stepNumber}
                  product={typeof step.product === 'object' ? step.product.name : step.product}
                  brand={typeof step.product === 'object' ? step.product.brand : ''}
                  instruction={step.instruction}
                  completed={morningCompleted[index]}
                  onToggle={() => toggleMorningStep(index)}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="night" className="space-y-4">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading routine...</p>
              </div>
            ) : !nightRoutine ? (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground mb-4">No night routine yet</p>
                <Button 
                  onClick={() => generateMutation.mutate('night')}
                  disabled={generateMutation.isPending}
                >
                  {generateMutation.isPending ? "Generating..." : "Generate Night Routine"}
                </Button>
              </Card>
            ) : (
              nightRoutine.steps.map((step: any, index: number) => (
                <RoutineStep
                  key={index}
                  stepNumber={step.stepNumber}
                  product={typeof step.product === 'object' ? step.product.name : step.product}
                  brand={typeof step.product === 'object' ? step.product.brand : ''}
                  instruction={step.instruction}
                  completed={nightCompleted[index]}
                  onToggle={() => toggleNightStep(index)}
                />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      <FloatingChatButton />
      <Navigation />
    </div>
  );
};

export default Routines;
