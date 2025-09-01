import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import { Target, Eye, ArrowRight, Shield, Lightbulb, Handshake, Award, TrendingUp } from "lucide-react"

const teamMembers = [
  {
    name: "Sleshi Million",
    role: "Accountant",
    qualifications: "ACCA, MBA",
    image: "/Sleshi.png?height=300&width=300&text=Sleshi+Million",
    bio: "Sleshi is an Certified Accountant who helps clients with their financial needs. and also a tax expert.",
  },
  {
    name: "Mark Million",
    role: "Accountant",
    qualifications: "ACCA, MBA",
    image: "/Mark.png?height=300&width=300&text=Mark+Million",
    bio: "Mark provides strategic business advice and growth planning, helping entrepreneurs and established businesses achieve their goals.",
  },
  {
    name: "Sarah Abera",
    role: "Social Media Manager",
    qualifications: "Certified Social Media Manager",
    image: "/Sarah.png?height=300&width=300&text=Sarah+Abera",
    bio: "Sarah is a Social Media Manager who helps the company with their social media presence. and also a graphic designer.",
  },
  {
    name: "Yadamzer Terefe",
    role: "Software Engineer",
    qualifications: "Certified Software Engineer",
    image: "/Yadamzer.jpg?height=300&width=300&text=Yadamzer+Terefe",
    bio: "Yadamzer is a Software Engineer who helps the company with their software development needs.",
  },
]

const values = [
  {
    icon: Shield,
    title: "Integrity",
    description: "We act with honesty, transparency, and professionalism in everything we do.",
  },
  {
    icon: Lightbulb,
    title: "Clarity",
    description: "We simplify the complex and speak your language, making finance accessible to all.",
  },
  {
    icon: TrendingUp,
    title: "Proactivity",
    description: "We anticipate, advise, and act—before the deadline, keeping you ahead of the curve.",
  },
  {
    icon: Handshake,
    title: "Partnership",
    description: "We work with you, not just for you, building lasting relationships based on trust.",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "We stay current, qualified, and committed to your growth and success.",
  },
]

export default function AboutPage() {
  // Function to handle video play and hide overlay
  const handleVideoPlay = (event: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = event.currentTarget;
    const overlay = video.parentElement?.querySelector('.video-overlay') as HTMLElement;
    if (overlay) {
      overlay.style.display = 'none';
    }
  };

  const handleVideoPause = (event: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = event.currentTarget;
    const overlay = video.parentElement?.querySelector('.video-overlay') as HTMLElement;
    if (overlay) {
      overlay.style.display = 'flex';
    }
  };

  // Function to unmute video on user interaction
  const handleVideoClick = (event: React.MouseEvent<HTMLVideoElement>) => {
    const video = event.currentTarget;
    if (video.muted) {
      video.muted = false;
      // Show unmuted indicator
      const unmuteIndicator = video.parentElement?.querySelector('.unmute-indicator') as HTMLElement;
      if (unmuteIndicator) {
        unmuteIndicator.style.display = 'block';
        setTimeout(() => {
          unmuteIndicator.style.display = 'none';
        }, 2000);
      }
    }
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">About The Millions</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A client-first, future-focused accountancy firm dedicated to helping individuals and businesses navigate
              the complexities of finance with confidence.
            </p>
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Who We Are</h2>
              {/* The millions company is the 2 brothers Mark and Sleshi Million so write about them*/}
              <p className="text-lg text-gray-600 mb-6">
                The Millions Chartered Certified Accountants is the 2 brothers Mark and Sleshi Million who are dedicated 
                to helping individuals and businesses navigate the complexities of finance with confidence. They are based in London, UK.
                and they are the founders of the company. They have been in the business for 10 years and they have a team of 10 people.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                The company is dedicated to helping individuals and businesses navigate the complexities of finance with confidence.
                They have big dreams and they are working hard to achieve them. 
                they are also working on a project to help people with their financial needs.
              </p>

              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">2014</div>
                  <div className="text-sm text-gray-600">Founded</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">500+</div>
                  <div className="text-sm text-gray-600">Clients Served</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">15+</div>
                  <div className="text-sm text-gray-600">Team Members</div>
                </div>
              </div>
            </div>

            <div className="relative group">
              {/* Video Container with Play Button Overlay */}
              <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-br from-blue-900 to-gray-900">
                                 {/* Video Background/Placeholder */}
                 <div className="aspect-video w-full bg-gradient-to-br from-blue-600/20 to-gray-800/20 flex items-center justify-center">
                   {/* Actual Video Element */}
                                       <video 
                      className="w-full h-full object-cover rounded-2xl cursor-pointer"
                      poster="/video-thumbnail.jpg"
                      preload="metadata"
                      autoPlay
                    //   muted
                      loop
                      playsInline
                      controls
                      onPlay={handleVideoPlay}
                      onPause={handleVideoPause}
                      onClick={handleVideoClick}
                    >
                     <source src="/promo.mp4" type="video/mp4" />
                     Your browser does not support the video tag.
                   </video>
                   
                                       {/* Play Button Overlay - Hidden when video is playing */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 video-overlay">
                      <div className="text-center">
                        <div className="w-20 h-20 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-xl cursor-pointer mx-auto mb-3">
                          <div className="w-0 h-0 border-l-[12px] border-l-blue-600 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1"></div>
                        </div>
                        <p className="text-white text-sm font-medium">Click to unmute</p>
                        <p className="text-white/80 text-xs">Video autoplays muted</p>
                      </div>
                    </div>

                    {/* Unmute Indicator */}
                    <div className="unmute-indicator absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium hidden">
                      🔊 Unmuted
                    </div>
                 </div>
                
                {/* Video Controls Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
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
                <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/10 transition-all duration-300 rounded-2xl"></div>
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
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
                <p className="text-gray-600">
                  To be recognised as a trusted financial partner that empowers our clients through clarity, compliance,
                  and strategic advice.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8">
              <CardContent className="pt-6">
                <Eye className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
                <p className="text-gray-600">
                  To deliver personalised, professional, and proactive accountancy services that support long-term
                  success and financial peace of mind.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Values */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              These core values guide every decision we make and every service we provide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <value.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our experienced team of ACCA certified professionals combines expertise with a personal touch, showcasing
              both our credentials and our human side.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
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
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Work Together?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Let's discuss how our team can help you achieve your financial goals with confidence and clarity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
          </div>
        </div>
      </section>
    </main>
  )
}
