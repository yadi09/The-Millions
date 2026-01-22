import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import { Target, Eye, ArrowRight, Shield, Lightbulb, Handshake, Award, TrendingUp } from "lucide-react"
import { useGetPageQuery } from "../../features/api/apiSlice"
import { Loader2 } from "lucide-react"
import { useState, useRef, useEffect } from "react"

// Icon mapping for values
const iconMap: Record<string, typeof Shield> = {
  shield: Shield,
  lightbulb: Lightbulb,
  "trending-up": TrendingUp,
  handshake: Handshake,
  award: Award,
}

export default function AboutPage() {
  const { data, isLoading, error } = useGetPageQuery('about')
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Extract sections early for useEffect dependency
  const sections = data?.sections || []
  const whoWeAreSection = sections.find((s: any) => s.type === 'who-we-are')

  // Check if video is playing on mount and after data loads
  // This must be before any early returns to follow Rules of Hooks
  useEffect(() => {
    const video = videoRef.current
    if (video && whoWeAreSection) {
      const checkVideoState = () => {
        if (video && !video.paused) {
          setIsVideoPlaying(true)
        }
      }
      
      const handlePlay = () => setIsVideoPlaying(true)
      const handlePause = () => setIsVideoPlaying(false)
      const handlePlaying = () => setIsVideoPlaying(true)
      
      // Check immediately
      checkVideoState()
      
      // Check after a short delay to catch autoplay
      const timeout = setTimeout(checkVideoState, 100)
      
      // Listen for play/pause events
      video.addEventListener('play', handlePlay)
      video.addEventListener('pause', handlePause)
      video.addEventListener('playing', handlePlaying)
      
      return () => {
        clearTimeout(timeout)
        video.removeEventListener('play', handlePlay)
        video.removeEventListener('pause', handlePause)
        video.removeEventListener('playing', handlePlaying)
      }
    }
  }, [whoWeAreSection])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Error loading page content. Please try again later.
      </div>
    )
  }

  const heroSection = sections.find((s: any) => s.type === 'hero')
  const missionVisionSection = sections.find((s: any) => s.type === 'mission-vision')
  const valuesSection = sections.find((s: any) => s.type === 'values')
  const teamSection = sections.find((s: any) => s.type === 'team')
  const ctaSection = sections.find((s: any) => s.type === 'cta')

  // Function to handle video play and hide overlay
  const handleVideoPlay = () => {
    setIsVideoPlaying(true)
  };

  const handleVideoPause = () => {
    setIsVideoPlaying(false)
  };

  // Function to handle play button click
  const handlePlayButtonClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {heroSection?.content?.title || "About The Millions"}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {heroSection?.content?.description || "A client-first, future-focused accountancy firm dedicated to helping individuals and businesses navigate the complexities of finance with confidence."}
            </p>
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {whoWeAreSection?.content?.title || "Who We Are"}
              </h2>
              {whoWeAreSection?.content?.description && Array.isArray(whoWeAreSection.content.description) && whoWeAreSection.content.description.length > 0 ? (
                whoWeAreSection.content.description.map((paragraph: string, index: number) => (
                  <p key={index} className="text-lg text-gray-600 mb-6">
                    {paragraph}
                  </p>
                ))
              ) : (
                <p className="text-lg text-gray-600 mb-6">
                  The Millions Chartered Certified Accountants is a client-first, future-focused accountancy firm dedicated to helping individuals and businesses navigate the complexities of finance with confidence.
                </p>
              )}

              {/* Stats Section */}
              {(() => {
                const stats = whoWeAreSection?.content?.stats;
                
                // Debug: Check what we're getting
                if (process.env.NODE_ENV === 'development') {
                  console.log('🔍 Stats Debug:', {
                    hasSection: !!whoWeAreSection,
                    hasContent: !!whoWeAreSection?.content,
                    stats: stats,
                    statsType: typeof stats,
                    isArray: Array.isArray(stats),
                    statsLength: Array.isArray(stats) ? stats.length : 0
                  });
                }
                
                if (stats && Array.isArray(stats) && stats.length > 0) {
                  return (
                    <div className="grid grid-cols-3 gap-6 mt-8">
                      {stats.map((stat: any, index: number) => {
                        // Handle both camelCase and other possible formats
                        const value = stat?.value ?? stat?.Value ?? '';
                        const label = stat?.label ?? stat?.Label ?? '';
                        
                        return (
                          <div key={index} className="text-center">
                            <div className="text-3xl font-bold text-blue-600">{value}</div>
                            <div className="text-sm text-gray-600">{label}</div>
                          </div>
                        );
                      })}
                    </div>
                  );
                }
                
                return null;
              })()}
            </div>

            <div className="relative group">
              {/* Video Container with Play Button Overlay */}
              <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-br from-blue-900 to-gray-900 aspect-video">
                {/* Actual Video Element */}
                <video 
                  ref={videoRef}
                  className="w-full h-full object-cover rounded-2xl cursor-pointer"
                  poster={whoWeAreSection?.content?.videoThumbnail || "/video-thumbnail.jpg"}
                  preload="metadata"
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls
                  onPlay={handleVideoPlay}
                  onPause={handleVideoPause}
                >
                  <source src={whoWeAreSection?.content?.videoUrl || "/promo.mp4"} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                
                {/* Play Button Overlay - Hidden when video is playing */}
                <div 
                  className={`absolute inset-0 flex items-center justify-center bg-black/20 video-overlay pointer-events-none transition-opacity duration-300 ${
                    isVideoPlaying ? 'opacity-0' : 'opacity-100'
                  }`}
                >
                  <div className="text-center pointer-events-auto">
                    <div 
                      onClick={handlePlayButtonClick}
                      className="w-20 h-20 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-xl cursor-pointer mx-auto mb-3"
                    >
                      <div className="w-0 h-0 border-l-[12px] border-l-blue-600 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1"></div>
                    </div>
                  </div>
                </div>
                
                {/* Video Controls Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 pointer-events-none">
                  <div className="flex items-center justify-between text-white">
                    <div>
                      <h4 className="font-semibold text-sm">The Millions</h4>
                      <p className="text-xs opacity-75">Building trust through excellence</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs opacity-75">ACCA Certified</span>
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    </div>
                  </div>
                </div>
                
                {/* Hover Effects */}
                <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/10 transition-all duration-300 rounded-2xl pointer-events-none"></div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-3 -right-3 w-6 h-6 bg-blue-500 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-green-400 rounded-full animate-bounce"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <Card className="text-center p-8">
              <CardContent className="pt-6">
                <Target className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {missionVisionSection?.content?.vision?.title || "Our Vision"}
                </h3>
                <p className="text-gray-600">
                  {missionVisionSection?.content?.vision?.description || "To be recognised as a trusted financial partner that empowers our clients through clarity, compliance, and strategic advice."}
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8">
              <CardContent className="pt-6">
                <Eye className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {missionVisionSection?.content?.mission?.title || "Our Mission"}
                </h3>
                <p className="text-gray-600">
                  {missionVisionSection?.content?.mission?.description || "To deliver personalised, professional, and proactive accountancy services that support long-term success and financial peace of mind."}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Values */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {valuesSection?.content?.title || "Our Values"}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {valuesSection?.content?.subtitle || "These core values guide every decision we make and every service we provide."}
            </p>
          </div>

          {valuesSection?.content?.values && Array.isArray(valuesSection.content.values) && valuesSection.content.values.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {valuesSection.content.values.map((value: any, index: number) => {
                const IconComponent = iconMap[value.icon] || Shield;
                return (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <IconComponent className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{value.title}</h3>
                    <p className="text-gray-600 text-sm">{value.description}</p>
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {teamSection?.content?.title || "Meet Our Team"}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {teamSection?.content?.subtitle || "Our experienced team of ACCA certified professionals combines expertise with a personal touch, showcasing both our credentials and our human side."}
            </p>
          </div>

          {teamSection?.content?.members && Array.isArray(teamSection.content.members) && teamSection.content.members.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamSection.content.members.map((member: any, index: number) => (
                <Card key={index} className="group hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <img
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                    />
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                    <p className="text-blue-600 font-medium mb-2">{member.role}</p>
                    <p className="text-sm text-gray-500 mb-4">{member.qualifications}</p>
                    <p className="text-gray-600 text-sm">{member.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {ctaSection?.content?.title || "Ready to Work Together?"}
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            {ctaSection?.content?.subtitle || "Let's discuss how our team can help you achieve your financial goals with confidence and clarity."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {ctaSection?.content?.actions?.map((action: any, index: number) => (
              <Button
                key={index}
                size="lg"
                className={index === 0 
                  ? "bg-white text-blue-600 hover:bg-gray-100"
                  : "border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
                }
                variant={index === 0 ? "default" : "outline"}
              >
                {action.label}
                {index === 0 && <ArrowRight className="w-5 h-5 ml-2" />}
              </Button>
            )) || (
              <>
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  Book Free Consultation
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
                >
                  View Our Services
                </Button>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
