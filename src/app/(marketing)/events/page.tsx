import type { Metadata } from "next";
import { CatalogBrowser } from "@/components/catalog-browser";
export const metadata: Metadata = { title: "Events", description: "Gatherings and upcoming events from Teens2Inspire." };
export default function EventsPage() { return <CatalogBrowser heading="Good things happen together." intro="Find upcoming gatherings and moments to learn, make, and connect." type="event" />; }
