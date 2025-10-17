import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { LucideIcon } from "lucide-react";
import { Wrench, HardHat, DraftingCompass, ClipboardList, Lightbulb, Users } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

type Service = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const services: Service[] = [
  {
    icon: HardHat,
    title: 'Civil Engineering',
    description: 'Comprehensive design and supervision for infrastructure projects, including roads, bridges, and public works.',
  },
  {
    icon: Wrench,
    title: 'General Contracting',
    description: 'Full-service contracting for commercial and residential projects, ensuring quality and timely completion.',
  },
  {
    icon: DraftingCompass,
    title: 'Architectural Design',
    description: 'Innovative and functional design solutions that blend aesthetics with structural integrity and sustainability.',
  },
  {
    icon: ClipboardList,
    title: 'Project Management',
    description: 'Expert oversight from conception to completion, managing budgets, schedules, and resources effectively.',
  },
  {
    icon: Lightbulb,
    title: 'Consulting Services',
    description: 'Providing strategic advice and technical expertise to help clients navigate complex engineering challenges.',
  },
  {
    icon: Users,
    title: 'Feasibility Studies',
    description: 'In-depth analysis of project viability, covering technical, economic, and legal aspects to ensure success.',
  },
];

const heroImage = PlaceHolderImages.find(p => p.id === 'services-hero');

export default function ServicesPage() {
  return (
    <div className="flex flex-col">
      <section className="relative w-full py-20 md:py-32 bg-secondary">
        {heroImage && (
            <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                fill
                className="object-cover"
                data-ai-hint={heroImage.imageHint}
            />
        )}
        <div className="absolute inset-0 bg-black/60" />
        <div className="container relative text-center text-white">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl font-headline">Our Programs &amp; Services</h1>
          <p className="max-w-2xl mx-auto mt-4 text-lg md:text-xl">
            Delivering excellence across a wide spectrum of engineering and construction disciplines.
          </p>
        </div>
      </section>

      <section className="bg-background">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <Card key={index} className="flex flex-col h-full transition-transform transform hover:-translate-y-2 hover:shadow-xl">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="bg-accent rounded-full p-3">
                    <service.icon className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <CardTitle className="text-xl font-headline">{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
