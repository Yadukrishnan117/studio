import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const heroImage = PlaceHolderImages.find(p => p.id === 'hero-main');
const teamMembers = [
  { id: 'team-1', name: 'Dr. Evelyn Reed', title: 'Chief Engineer' },
  { id: 'team-2', name: 'Marcus Thorne', title: 'Lead Contractor' },
  { id: 'team-3', name: 'Jasmine Patel', title: 'Project Manager' },
  { id: 'team-4', name: 'Leo Martinez', title: 'Structural Analyst' },
];

const newsItems = [
  {
    date: 'July 26, 2024',
    title: 'ZELESTE Awarded Landmark Skyscraper Project',
    description: 'We are thrilled to announce our involvement in the construction of the new downtown Azure Tower, a project that will redefine the city skyline.',
  },
  {
    date: 'June 15, 2024',
    title: 'Innovation in Sustainable Engineering Materials',
    description: 'Our R&D team has published a groundbreaking paper on a new composite material that is both stronger and more environmentally friendly.',
  },
  {
    date: 'May 01, 2024',
    title: 'Community Bridge Project Completed Ahead of Schedule',
    description: 'The Oakwood Community Bridge is now open to the public, connecting neighborhoods and showcasing our commitment to efficient project delivery.',
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <section className="relative w-full h-[60vh] md:h-[80vh] flex items-center justify-center text-center">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            priority
            data-ai-hint={heroImage.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative container px-4 md:px-6">
          <div className="max-w-3xl mx-auto space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter text-white sm:text-5xl md:text-6xl font-headline">
              Engineering the Future, Building a Better Tomorrow
            </h1>
            <p className="text-lg text-gray-200 md:text-xl">
              ZELESTE provides world-class engineering and contracting services, turning ambitious visions into tangible realities.
            </p>
            <div>
              <Link href="/contact">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Get in Touch
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <section id="about" className="bg-card">
        <div className="container px-4 md:px-6">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <Badge className="bg-accent text-accent-foreground">About Us</Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mt-4 font-headline">
                Our Mission &amp; History
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mt-4">
                Founded on the principles of innovation, integrity, and quality, ZELESTE has grown from a small team of passionate engineers to a leading name in the contracting industry. Our mission is to deliver exceptional results that exceed client expectations while upholding the highest standards of safety and sustainability.
              </p>
            </div>
            <div className="flex flex-col gap-6">
              <h3 className="text-2xl font-bold tracking-tighter sm:text-3xl font-headline">Meet Our Leadership</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {teamMembers.map(member => {
                  const image = PlaceHolderImages.find(p => p.id === member.id);
                  return (
                    <Card key={member.name} className="flex flex-col items-center p-4 text-center">
                      <Avatar className="w-24 h-24 mb-4">
                        {image && <AvatarImage src={image.imageUrl} alt={member.name} data-ai-hint={image.imageHint} />}
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <CardTitle className="text-lg font-medium font-headline">{member.name}</CardTitle>
                      <p className="text-sm text-accent">{member.title}</p>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="news" className="bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <Badge className="bg-accent text-accent-foreground">News &amp; Updates</Badge>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Latest from ZELESTE</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Stay informed with our latest announcements, project milestones, and industry insights.
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 lg:grid-cols-3 lg:gap-8">
            {newsItems.map((item, index) => (
              <Card key={index} className="h-full flex flex-col">
                <CardHeader>
                  <p className="text-sm text-muted-foreground">{item.date}</p>
                  <CardTitle className="text-xl font-headline">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="link" className="p-0">Read More &rarr;</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
