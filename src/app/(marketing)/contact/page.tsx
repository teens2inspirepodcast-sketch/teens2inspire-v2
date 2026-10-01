import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
export const metadata: Metadata = { title: "Contact Teens2Inspire", description: "Get in touch with the Teens2Inspire team." };
export default function ContactPage() { return <main className="contact-page"><div className="contact-copy"><span className="eyebrow eyebrow-gold">We are here</span><h1>Need a hand?<br /><em>Say hello.</em></h1><p>Questions about an account, a story, an event, or privacy? Send the Teens2Inspire team a note.</p><p className="contact-private">Messages are sent privately to our support team. Please do not include sensitive personal details.</p></div><ContactForm /></main>; }
