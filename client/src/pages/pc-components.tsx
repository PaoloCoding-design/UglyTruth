
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { PC_COMPONENT_TYPES, PC_COMPONENT_LABELS, COMPONENT_BRANDS, type PCComponentType } from "@shared/schema";
import { Cpu, Monitor, HardDrive, Zap, MemoryStick, Fan, Box } from "lucide-react";

const COMPONENT_ICONS: Record<PCComponentType, React.ReactNode> = {
  cpu: <Cpu className="h-8 w-8" />,
  gpu: <Monitor className="h-8 w-8" />,
  ram: <MemoryStick className="h-8 w-8" />,
  psu: <Zap className="h-8 w-8" />,
  motherboard: <Box className="h-8 w-8" />,
  storage: <HardDrive className="h-8 w-8" />,
  cooling: <Fan className="h-8 w-8" />
};

export default function PCComponentsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <section className="py-8 px-4 border-b">
          <div className="mx-auto max-w-7xl">
            <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">
              PC Components
            </h1>
            <p className="text-muted-foreground max-w-3xl leading-relaxed">
              Choose a component type to explore products and their potential drawbacks
            </p>
          </div>
        </section>

        <section className="py-12 px-4">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {PC_COMPONENT_TYPES.map((type) => (
                <Link key={type} href={`/pc-components/${type}`}>
                  <Card className="group hover-elevate cursor-pointer h-full">
                    <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                      <div className="p-4 rounded-lg bg-muted group-hover:bg-ugly-red/10 transition-colors">
                        {COMPONENT_ICONS[type]}
                      </div>
                      <h3 className="font-semibold text-lg">
                        {PC_COMPONENT_LABELS[type]}
                      </h3>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
