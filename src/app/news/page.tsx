import { Rocket, Trophy, BatteryCharging } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

const newsHighlights = [
  {
    icon: Rocket,
    title: 'Successful Commissioning',
    description: 'Commissioned 20+ EV fast charging stations across South India in partnership with leading oil companies.',
  },
  {
    icon: Trophy,
    title: 'Strategic Expansion',
    description: 'Expanding operations to North and Central India with new strategic collaborations.',
  },
  {
    icon: BatteryCharging,
    title: 'Smart-Charging Systems',
    description: 'Introducing advanced smart-charging systems to improve efficiency and reliability.',
  },
];

export default function NewsPage() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <section className="relative w-full py-20 md:py-32 bg-secondary">
        <Image
          src="https://picsum.photos/seed/news-hero/1200/400"
          alt="News background"
          fill
          className="object-cover"
          data-ai-hint="newspaper article"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="container relative text-center text-white">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl font-headline">News & Updates</h1>
          <p className="max-w-3xl mx-auto mt-4 text-lg md:text-xl">
            Stay connected with Zeleste Engineers for the latest on our projects, new installations, and developments in the EV charging sector.
          </p>
        </div>
      </section>

      <section id="highlights" className="bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <Badge className="bg-accent text-accent-foreground">Recent Highlights</Badge>
          </div>
          <div className="mx-auto grid max-w-5xl items-stretch gap-6 py-12 lg:grid-cols-3 lg:gap-8">
            {newsHighlights.map((item, index) => (
              <Card key={index} className="h-full flex flex-col transition-transform transform hover:-translate-y-2 hover:shadow-xl">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="bg-accent rounded-full p-3">
                    <item.icon className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <CardTitle className="text-xl font-headline">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
           <div className="max-w-3xl mx-auto text-center mt-8">
            <p className="text-lg text-foreground">
              Follow our updates for upcoming project launches and industry insights.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
