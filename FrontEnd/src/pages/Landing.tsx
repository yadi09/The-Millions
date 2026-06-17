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

  // Visibility-aware section rendering: the backend filters out hidden
  // sections from /api/pages/home, so a section's absence from
  // pageData.sections means "toggled off — don't render". Until the
  // page query has resolved (pageData is undefined), render everything
  // from fallback so the first paint isn't blank. Once data arrives,
  // the brothers' on/off toggles take effect.
  const visibleTypes: Set<string> | null = pageData?.sections
    ? new Set(pageData.sections.map((s) => s.type))
    : null;
  const show = (type: string): boolean => visibleTypes === null || visibleTypes.has(type);

  return (
    <div className="flex flex-col">
      {show('hero') && <HeroSection content={getSectionContent('hero', 'hero')} />}
      {show('philosophy') && <PhilosophySection content={getSectionContent('philosophy', 'philosophy')} />}
      {show('overview') && <OverviewSection content={getSectionContent('overview', 'overview')} />}
      {show('mission-vision') && <MissionVisionSection content={getSectionContent('mission-vision', 'missionVision')} />}
      {show('values') && <ValuesSection content={getSectionContent('values', 'values')} />}
      {show('impact-model') && <ImpactModelSection content={getSectionContent('impact-model', 'impactModel')} />}
      {show('services') && <ServicesSection content={servicesContent} />}
      {show('geography') && <GeographySection content={getSectionContent('geography', 'geography')} />}
      {show('social-impact') && <SocialImpactSection content={getSectionContent('social-impact', 'socialImpact')} />}
      {show('leadership') && <LeadershipSection content={getSectionContent('leadership', 'leadership')} />}
      {show('future-vision') && <FutureVisionSection content={getSectionContent('future-vision', 'futureVision')} />}
    </div>
  );
};

export default Landing;
