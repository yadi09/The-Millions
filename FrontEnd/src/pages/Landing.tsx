import { useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
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
import { useGetPageQuery } from '../features/api/apiSlice';
import type { RootState } from '../app/store';

const Landing = () => {
  // Admin preview override: append ?preview=1 to the URL while logged in
  // to see sections that are toggled off (so they can be reviewed before
  // being flipped live). Server-side verifies the token, so a non-admin
  // appending ?preview=1 still gets the filtered view.
  const [searchParams] = useSearchParams();
  const isAuthed = useSelector((s: RootState) => s.auth.isAuthenticated);
  const preview = searchParams.get('preview') === '1' && isAuthed;
  const { data: pageData } = useGetPageQuery({ slug: 'home', preview });

  const getSectionContent = (type: string, fallbackKey: keyof typeof landingContent): any => {
    const section = pageData?.sections?.find(s => s.type === type);
    if (!section?.content) return landingContent[fallbackKey];

    // MAPPING LOGIC: Translate backend fields to component props
    const content = { ...section.content };

    if (type === 'hero') {
      return {
        ...landingContent.hero, // Keep defaults for missing fields
        label: content.badge || landingContent.hero.label,
        title: content.headlineBlack || landingContent.hero.title,
        titleEm: content.headlineBlue || landingContent.hero.titleEm,
        subText: content.description || landingContent.hero.subText,
        primaryCta: (typeof content.ctas?.[0] === 'object' ? content.ctas[0].label : content.ctas?.[0]) || landingContent.hero.primaryCta,
        ghostCta: (typeof content.ctas?.[1] === 'object' ? content.ctas[1].label : content.ctas?.[1]) || landingContent.hero.ghostCta,
        stats: content.stats || landingContent.hero.stats,
      };
    }

    if (type === 'services') {
      // Prefer the new `items` field (what the inline editor saves) over the
      // legacy `cards` shape from the initial seed. When falling back to
      // `cards`, map their `description` → `text` so the component still
      // renders the body copy. Final fallback is the bundled static content.
      const items: { title: string; text: string }[] = content.items?.length
        ? content.items
        : content.cards?.length
          ? content.cards.map((c: any) => ({
              title: c.title ?? '',
              text: c.description ?? c.text ?? '',
            }))
          : landingContent.services.items;

      return {
        ...landingContent.services,
        title: content.title || landingContent.services.title,
        items,
        footer: {
          title: content.footerTitle || content.subtitle || landingContent.services.footer.title,
          text: content.footerText || (content.footerTitle && !content.subtitle ? "" : (content.subtitle ? "" : landingContent.services.footer.text)),
        }
      };
    }

    return { ...landingContent[fallbackKey], ...content };
  };

  // Services cards now come from the page section's `items` directly, edited
  // inline alongside the other landing content. /api/services remains the
  // contact form's service-category dropdown — a separate concern.
  const servicesContent = getSectionContent('services', 'services');

  return (
    <div className="flex flex-col">
      <HeroSection content={getSectionContent('hero', 'hero')} />
      <PhilosophySection content={getSectionContent('philosophy', 'philosophy')} />
      <OverviewSection content={getSectionContent('overview', 'overview')} />
      <MissionVisionSection content={getSectionContent('mission-vision', 'missionVision')} />
      <ValuesSection content={getSectionContent('values', 'values')} />
      <ImpactModelSection content={getSectionContent('impact-model', 'impactModel')} />
      <ServicesSection content={servicesContent} />
      <GeographySection content={getSectionContent('geography', 'geography')} />
      <SocialImpactSection content={getSectionContent('social-impact', 'socialImpact')} />
      <LeadershipSection content={getSectionContent('leadership', 'leadership')} />
      <FutureVisionSection content={getSectionContent('future-vision', 'futureVision')} />
    </div>
  );
};

export default Landing;
