import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import { Zap, CircuitBoard, HardHat, FileText, Wrench } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

type Service = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const services: Service[] = [
  {
    icon: Zap,
    title: 'EV Charger Installation',
    description: 'Complete setup of AC and DC fast chargers at fuel stations, commercial spaces, and public locations.',
  },
  {
    icon: CircuitBoard,
    title: 'Electrical & Panel Works',
    description: 'Supply and installation of panels, cables, earthing systems, and load management equipment.',
  },
  {
    icon: HardHat,
    title: 'Site Development & Civil Works',
    description: 'Foundation construction, canopy setup, and charger room fabrication as per standards.',
  },
  {
    icon: FileText,
    title: 'KSEB Liaisoning & Approvals',
    description: 'Assistance with electrical inspections, permits, and power connection formalities.',
  },
  {
    icon: Wrench,
    title: 'Maintenance & Support',
    description: 'Routine inspection, troubleshooting, and performance optimization for installed chargers.',
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
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl font-headline">Our Services</h1>
          <p className="max-w-3xl mx-auto mt-4 text-lg md:text-xl">
            We offer a complete range of services focused on EV charging infrastructure development.
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
          <div className="max-w-3xl mx-auto text-center mt-16">
            <p className="text-lg text-foreground">
                Our turnkey approach ensures smooth execution — from planning to power-on — across urban and rural locations in India.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
