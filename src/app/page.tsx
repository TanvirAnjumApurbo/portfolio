import { NameReveal } from "@/components/NameReveal";
import { ChaptersSection } from "@/components/chapters/chapters-section";
import { ProjectsSection } from "@/components/projects/projects-section";
import { ResearchSection } from "@/components/research/research-section";
import { StackSection } from "@/components/stack/stack-section";
import { TimelineSection } from "@/components/timeline/timeline-section";
import { ContactSection } from "@/components/contact/contact-section";

export default function Home() {
  return (
    <main>
      <NameReveal />
      <ChaptersSection />
      <ProjectsSection />
      <ResearchSection />
      <StackSection />
      <TimelineSection />
      <ContactSection />
    </main>
  );
}
