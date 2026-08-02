import {
    Hero,
    Features,
    HowItWorks,
    CommunityPreview,
    Testimonials,
    RoadmapPreview,
    LandingFooter,
} from "@/components/landing";
import PageContainer from "@/components/common/PageContainer";

/**
 * Public Landing page
 *
 * Renders all marketing sections in the fixed order:
 * Hero → Features → How It Works → Community → Testimonials → Roadmap Preview → Footer.
 * Wrapped in PageContainer for responsive padding, max-width, and no horizontal overflow.
 *
 * This is a Server Component — no "use client" needed.
 */
export default function LandingPage() {
    return (
        <PageContainer className="flex min-h-screen flex-col">
            <Hero />
            <Features />
            <HowItWorks />
            <CommunityPreview />
            <Testimonials />
            <RoadmapPreview />
            <LandingFooter />
        </PageContainer>
    );
}
