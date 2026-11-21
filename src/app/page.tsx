import { Agents } from "@/components/agents";
import { Benchmarks } from "@/components/benchmarks";
import { Daemon } from "@/components/daemon";
import { Faq } from "@/components/faq";
import { Features } from "@/components/features";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Install } from "@/components/install";
import { Internals } from "@/components/internals";
import { JsonLd } from "@/components/json-ld";
import { Nav } from "@/components/nav";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Agents />
        <Features />
        <Daemon />
        <Internals />
        <Benchmarks />
        <Install />
        <Faq />
      </main>
      <Footer />
      <JsonLd />
    </>
  );
}
