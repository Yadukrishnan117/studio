import { ContactForm } from "@/components/contact-form";
import { Mail, Phone, MapPin, Globe } from "lucide-react";

export default function ContactPage() {
  return (
    <>
      <section className="bg-secondary py-20 md:py-32">
        <div className="container text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl font-headline text-primary">
              Contact Us
            </h1>
            <p className="max-w-2xl mx-auto mt-4 text-lg text-secondary-foreground md:text-xl">
              We’d love to hear from you. Whether you’re looking to install an EV charging station or partner with us for a project, feel free to reach out.
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
                  <h3 className="text-xl font-semibold">Headquarters</h3>
                  <p className="text-muted-foreground">Venchavode Lane, Gandhipuram, Chavadimukku, Sreekariyam, Thiruvananthapuram, Kerala – 695017</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-accent rounded-full p-3 mt-1">
                  <Phone className="h-6 w-6 text-accent-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Phone</h3>
                  <p className="text-muted-foreground">+91 7306150822</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-accent rounded-full p-3 mt-1">
                  <Mail className="h-6 w-6 text-accent-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Email</h3>
                  <p className="text-muted-foreground">eczeleste@gmail.com</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-accent rounded-full p-3 mt-1">
                  <Globe className="h-6 w-6 text-accent-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Website</h3>
                  <p className="text-muted-foreground">
                    <a href="http://www.zeleste.in" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                      www.zeleste.in
                    </a>
                  </p>
                </div>
              </div>
            </div>
            <div className="p-8 rounded-lg shadow-lg bg-card">
              <h2 className="text-3xl font-bold mb-2 font-headline">Send Us a Message</h2>
              <p className="text-muted-foreground mb-6">
                Use the contact form below to submit your inquiry. Our team will get back to you soon.
              </p>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
