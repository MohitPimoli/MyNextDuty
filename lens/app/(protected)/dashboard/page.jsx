import Greeting from "@/components/dashboard/Greeting";
import CardGrid from "@/components/dashboard/CardGrid";
import QuickActions from "@/components/dashboard/QuickActions";
import PageContainer from "@/components/common/PageContainer";

/**
 * Dashboard page — the authenticated user's home screen.
 *
 * Composes Greeting + CardGrid + QuickActions in a vertical stack.
 * Each card within CardGrid manages its own async state via StateRenderer.
 * Wrapped in PageContainer for responsive padding and max-width.
 *
 * Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8, 7.9
 */
const DashboardPage = () => {
    return (
        <PageContainer className="flex flex-col gap-8">
            <Greeting />
            <QuickActions />
            <CardGrid />
        </PageContainer>
    );
};

export default DashboardPage;
