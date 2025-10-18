import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';

const heroImage = PlaceHolderImages.find(p => p.id === 'about-hero');

export default function AboutPage() {
  return (
    <>
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
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl font-headline">About Us</h1>
          <p className="max-w-3xl mx-auto mt-4 text-lg md:text-xl">
            Powering the future of sustainable mobility in India.
          </p>
        </div>
      </section>

      <section className="bg-background">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <div className="space-y-6 text-lg text-foreground">
                <p>
                    Zeleste Engineers and Contractors LLP is a leading engineering company specializing in EV charging station infrastructure development across India.
                </p>
                <p>
                    With a mission to accelerate India’s transition toward sustainable mobility, we design, develop, and execute complete EV charging solutions — from site survey to installation and commissioning.
                </p>
                <p>
                    Founded with a vision to build a cleaner and smarter transportation ecosystem, Zeleste Engineers has rapidly grown into a trusted partner for fuel retailers, corporate clients, and EV infrastructure developers. Our expert team of engineers, electricians, and project managers ensures each project meets the highest standards of quality, safety, and efficiency.
                </p>
                <p>
                    At Zeleste Engineers, we believe that electric mobility is the future — and we’re proud to be powering that change, one charger at a time.
                </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
