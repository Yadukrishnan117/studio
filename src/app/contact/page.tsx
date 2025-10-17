import { ContactForm } from "@/components/contact-form";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <>
      <section className="bg-secondary py-20 md:py-32">
        <div className="container text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl font-headline text-primary">
              Contact Us
            </h1>
            <p className="max-w-2xl mx-auto mt-4 text-lg text-secondary-foreground md:text-xl">
              We're here to help. Reach out to us with any questions or to discuss your next project.
            </p>
        </div>
      </section>
      <section className="bg-background">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <h2 className="text-3xl font-bold font-headline">Get in Touch Directly</h2>
              <div className="flex items-start space-x-4">
                <div className="bg-accent rounded-full p-3 mt-1">
                  <MapPin className="h-6 w-6 text-accent-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Address</h3>
                  <p className="text-muted-foreground">123 Engineering Lane, Tech City, 12345</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-accent rounded-full p-3 mt-1">
                  <Phone className="h-6 w-6 text-accent-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Phone</h3>
                  <p className="text-muted-foreground">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-accent rounded-full p-3 mt-1">
                  <Mail className="h-6 w-6 text-accent-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Email</h3>
                  <p className="text-muted-foreground">contact@zeleste.co</p>
                </div>
              </div>
            </div>
            <div className="p-8 rounded-lg shadow-lg bg-card">
              <h2 className="text-3xl font-bold mb-6 font-headline">Send Us a Message</h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
