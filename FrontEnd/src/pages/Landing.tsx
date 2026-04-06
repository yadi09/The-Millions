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

const Landing = () => {
  return (
    <div className="flex flex-col">
      <HeroSection content={landingContent.hero} />
      <PhilosophySection content={landingContent.philosophy} />
      <OverviewSection content={landingContent.overview} />
      <MissionVisionSection content={landingContent.missionVision} />
      <ValuesSection content={landingContent.values} />
      <ImpactModelSection content={landingContent.impactModel} />
      <ServicesSection content={landingContent.services} />
      <GeographySection content={landingContent.geography} />
      <SocialImpactSection content={landingContent.socialImpact} />
      <LeadershipSection content={landingContent.leadership} />
      <FutureVisionSection content={landingContent.futureVision} />
    </div>
  );
};

export default Landing;
