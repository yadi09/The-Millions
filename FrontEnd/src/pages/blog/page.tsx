import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Input } from "../../components/ui/input"
import { Calendar, User, ArrowRight, Search, TrendingUp, Loader2 } from "lucide-react"
import { Link } from "react-router-dom"
import { useGetPageQuery } from "../../features/api/apiSlice"

// Mock Data (In real app, this would be useGetBlogPostsQuery)
const blogPosts = [
  {
    id: "2024-tax-changes",
    title: "2024 Tax Changes: What You Need to Know",
    excerpt:
      "Stay ahead of the latest tax changes affecting individuals and businesses in 2024. Our comprehensive guide covers key updates and planning strategies.",
    category: "Tax Tips",
    author: "Sarah Mitchell",
    date: "March 15, 2024",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1554224155-1696413565d3?q=80&w=2070&auto=format&fit=crop",
    featured: true, // Legacy flag, will be overridden by Admin config
  },
  {
    id: "cloud-accounting-future",
    title: "Cloud Accounting: The Future is Now",
    excerpt:
      "Discover how cloud accounting can transform your business operations, improve efficiency, and provide real-time financial insights.",
    category: "Technology",
    author: "Emily Chen",
    date: "March 10, 2024",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?q=80&w=2070&auto=format&fit=crop",
    featured: false,
  },
  {
    id: "property-investment-strategies",
    title: "Property Investment Tax Strategies",
    excerpt:
      "Maximize your property investment returns with these proven tax strategies and planning techniques for landlords and investors.",
    category: "Property",
    author: "James Thompson",
    date: "March 5, 2024",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1576643632849-032a2373c2ce?q=80&w=1974&auto=format&fit=crop",
    featured: false,
  },
  {
    id: "small-business-growth-planning",
    title: "Small Business Growth: Financial Planning Essentials",
    excerpt:
      "Essential financial planning strategies to fuel your small business growth, from cash flow management to investment planning.",
    category: "Business Growth",
    author: "Michael Roberts",
    date: "February 28, 2024",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1560518883-ce09059ee353?q=80&w=1974&auto=format&fit=crop",
    featured: false,
  },
  {
    id: "vat-registration-guide",
    title: "VAT Registration: When and How",
    excerpt:
      "Everything you need to know about VAT registration, including thresholds, benefits, and the registration process.",
    category: "Tax Tips",
    author: "Sarah Mitchell",
    date: "February 20, 2024",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1599582784863-fad474514759?q=80&w=1974&auto=format&fit=crop",
    featured: false,
  },
  {
    id: "year-end-accounts-checklist",
    title: "Year-End Accounts: Preparation Checklist",
    excerpt:
      "Ensure your year-end accounts preparation goes smoothly with our comprehensive checklist and expert tips.",
    category: "Business Growth",
    author: "Emily Chen",
    date: "February 15, 2024",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1605719058145-7833c949d2e0?q=80&w=2070&auto=format&fit=crop",
    featured: false,
  },
]

// Dynamically generate categories from posts
const generateCategories = (posts: typeof blogPosts) => {
  const map = new Map<string, number>();
  posts.forEach(post => {
    const count = map.get(post.category) || 0;
    map.set(post.category, count + 1);
  });

  return Array.from(map.entries()).map(([name, count]) => ({
    name,
    count,
    icon: TrendingUp // Default icon for now
  }));
};

export default function BlogPage() {
  const { data: pageConfig, isLoading: isConfigLoading } = useGetPageQuery('blog');

  // --- Configuration Extraction ---
  const heroSection = pageConfig?.sections?.find((s: any) => s.type === 'hero');
  const featuredSection = pageConfig?.sections?.find((s: any) => s.type === 'featured-posts');
  const popularSection = pageConfig?.sections?.find((s: any) => s.type === 'popular-posts');
  //   const settingsSection = pageConfig?.sections?.find((s: any) => s.type === 'page-settings');

  // --- Data Logic (Dynamic) ---
  const categories = generateCategories(blogPosts);

  // Determine Featured Post (Config > Hardcoded)
  const featuredPostId = featuredSection?.content?.featuredPostId;
  const featuredPost = featuredPostId
    ? blogPosts.find(p => p.id === featuredPostId)
    : blogPosts.find(p => p.featured) || blogPosts[0];

  // Regular posts (everything except featured)
  const regularPosts = blogPosts.filter(p => p.id !== featuredPost?.id);

  if (isConfigLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 text-slate-800">
      {/* Hero Section (Controlled by Admin) */}
      <section className="bg-gradient-to-br from-blue-100 to-slate-50 py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {heroSection?.content?.badge && (
              <Badge variant="outline" className="mb-4">{heroSection.content.badge}</Badge>
            )}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight px-2">
              {heroSection?.content?.headlineBlack || "Financial Insights"} <span className="text-blue-600">{heroSection?.content?.headlineBlue || "& Tips"}</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-3xl mx-auto mb-10 leading-relaxed px-4">
              {heroSection?.content?.description || "Stay informed with the latest updates and strategies from our expert team."}
            </p>

            {/* Search Bar */}
            <div className="max-w-lg mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                placeholder="Search for articles, e.g., 'tax changes'"
                className="pl-12 pr-4 py-3 text-lg rounded-full bg-white/80 backdrop-blur-sm border-white/40 shadow-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Featured Post (Controlled by Admin) */}
            {featuredPost && (
              <div className="mb-12 group">
                <Badge className="mb-4 bg-blue-600 text-white">
                  {featuredSection?.content?.title || "Featured Article"}
                </Badge>
                <Card className="overflow-hidden bg-slate-900 text-white rounded-2xl shadow-2xl transition-all duration-300 hover:-translate-y-1">
                  <div className="md:flex">
                    <div className="md:w-1/2 overflow-hidden">
                      <Link to={`/blog/${featuredPost.id}`}>
                        <img
                          src={featuredPost.image || "/placeholder.svg"}
                          alt={featuredPost.title}
                          className="w-full h-64 md:h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </Link>
                    </div>
                    <div className="md:w-1/2 p-8 sm:p-10 flex flex-col justify-center">
                      <Badge variant="secondary" className="mb-3 w-fit bg-white/10 text-blue-300 text-xs">
                        {featuredPost.category}
                      </Badge>
                      <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-4 leading-tight">
                        {featuredPost.title}
                      </h2>
                      <p className="text-sm md:text-base text-slate-300 mb-6 leading-relaxed line-clamp-3 md:line-clamp-none">
                        {featuredPost.excerpt}
                      </p>

                      <div className="flex items-center gap-4 text-sm text-slate-400 mb-6">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          {featuredPost.author}
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {featuredPost.date}
                        </div>
                        <span className="hidden sm:inline">{featuredPost.readTime}</span>
                      </div>

                      <Link to={`/blog/${featuredPost.id}`} className="self-start">
                        <Button
                          variant="outline"
                          className="bg-transparent border-blue-400 text-blue-300 hover:bg-blue-400 hover:text-white group/button"
                        >
                          Read Full Article
                          <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover/button:translate-x-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Regular Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {regularPosts.map((post) => (
                <Card
                  key={post.id}
                  className="group overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1 backdrop-blur-sm bg-white/80 border border-white/40 shadow-sm"
                >
                  <Link to={`/blog/${post.id}`} className="block overflow-hidden aspect-video">
                    <img
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </Link>
                  <div className="p-6">
                    <Badge variant="secondary" className="mb-3 w-fit">
                      {post.category}
                    </Badge>
                    <CardTitle className="leading-tight group-hover:text-blue-600 transition-colors mb-3">
                      <Link to={`/blog/${post.id}`}>{post.title}</Link>
                    </CardTitle>
                    <p className="text-slate-600 mb-4 leading-relaxed line-clamp-3">{post.excerpt}</p>

                    <div className="flex items-center gap-4 text-sm text-slate-500 mt-auto pt-4 border-t border-slate-200/80">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {post.author}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {post.date}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-16">
              <Button size="lg" variant="outline" className="group/button">
                Load More Articles
                <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover/button:translate-x-1" />
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-8 lg:sticky lg:top-24">

            {/* Dynamic Categories */}
            <Card className="rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1 backdrop-blur-sm bg-white/80 border border-white/40 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <Link
                      key={category.name}
                      to="#"
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-blue-50/50 group"
                    >
                      <div className="flex items-center gap-3">
                        <category.icon className="w-5 h-5 text-blue-600" />
                        <span className="font-medium group-hover:text-blue-700">{category.name}</span>
                      </div>
                      <Badge variant="secondary" className="bg-slate-200/80 text-slate-600">
                        {category.count}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Newsletter Signup */}
            <Card className="rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1 backdrop-blur-sm bg-white/80 border border-white/40 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Stay Updated</CardTitle>
                <p className="text-slate-600 leading-relaxed pt-1">
                  Get the latest financial insights delivered to your inbox.
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Input placeholder="Your email address" className="rounded-lg" />
                  <Button className="w-full rounded-lg group/button">
                    Subscribe
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover/button:translate-x-1" />
                  </Button>
                  <p className="text-xs text-slate-500 text-center">We respect your privacy. No spam.</p>
                </div>
              </CardContent>
            </Card>

            {/* Popular Posts (Controlled by Admin) */}
            {popularSection?.content?.show !== false && (
              <Card className="rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1 backdrop-blur-sm bg-white/80 border border-white/40 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">{popularSection?.content?.title || "Popular This Month"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Mock popular logic - take first 3 for now */}
                    {blogPosts.slice(0, 3).map((post) => (
                      <Link key={post.id} to={`/blog/${post.id}`} className="flex gap-4 group cursor-pointer items-center">
                        <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded-lg">
                          <img
                            src={post.image || "/placeholder.svg"}
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-slate-800 group-hover:text-blue-600 line-clamp-2 text-sm leading-tight">
                            {post.title}
                          </h4>
                          <p className="text-xs text-slate-500 mt-1">{post.date}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </aside>
        </div>
      </div>
    </main>
  )
}