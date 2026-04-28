import { HeroSection } from '../components/landing/HeroSection';
import { PhilosophySection } from '../components/landing/PhilosophySection';
import { OverviewSection } from '../components/landing/OverviewSection';
import { MissionVisionSection } from '../components/landing/MissionVisionSection';
import { ValuesSection } from '../components/landing/ValuesSection';
import { ImpactModelSection } from '../components/landing/ImpactModelSection';
import { ServicesSection } from '../components/landing/ServicesSection';
import { GeographySection } from '../components/landing/GeographySection';
import { SocialImpactSection } from '../components/landing/SocialImpactSection';
import { LeadershipSection } from '../components/landing/LeadershipSection';
import { FutureVisionSection } from '../components/landing/FutureVisionSection';
import { landingContent } from '../data/landingContent';
import { useGetPageQuery, useGetServicesQuery } from '../features/api/apiSlice';

const Landing = () => {
  const { data: pageData } = useGetPageQuery('home');
  const { data: servicesData } = useGetServicesQuery();

  const getSectionContent = (type: string, fallbackKey: keyof typeof landingContent): any => {
    const section = pageData?.sections?.find(s => s.type === type);
    return section?.content || landingContent[fallbackKey];
  };

  // Extract base Services architecture (Header/Footer)
  const baseServicesContent = getSectionContent('services', 'services');

  // Dynamically map real services from the DB into the UI format
  const dynamicServicesItems = servicesData?.length 
    ? servicesData.map(service => ({
        title: service.name,
        text: service.description || ""
      }))
    : baseServicesContent.items; // Fallback to static items if DB is empty

  // Merge the architecture header with the dynamic items
  const mergedServicesContent = {
    ...baseServicesContent,
    items: dynamicServicesItems
  };

  return (
    <div className="flex flex-col">
      <HeroSection content={getSectionContent('hero', 'hero')} />
      <PhilosophySection content={getSectionContent('philosophy', 'philosophy')} />
      <OverviewSection content={getSectionContent('overview', 'overview')} />
      <MissionVisionSection content={getSectionContent('mission-vision', 'missionVision')} />
      <ValuesSection content={getSectionContent('values', 'values')} />
      <ImpactModelSection content={getSectionContent('impact-model', 'impactModel')} />
      <ServicesSection content={mergedServicesContent} />
      <GeographySection content={getSectionContent('geography', 'geography')} />
      <SocialImpactSection content={getSectionContent('social-impact', 'socialImpact')} />
      <LeadershipSection content={getSectionContent('leadership', 'leadership')} />
      <FutureVisionSection content={getSectionContent('future-vision', 'futureVision')} />
    </div>
  );
};

export default Landing;
