import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Input } from "../../components/ui/input"
import { Calendar, User, ArrowRight, Search, TrendingUp, Loader2 } from "lucide-react"
import { Link } from "react-router-dom"
import { useGetPageQuery, useGetPublicBlogPostsQuery } from "../../features/api/apiSlice"

export default function BlogPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  const { data: pageConfig, isLoading: isConfigLoading } = useGetPageQuery('blog');
  const { data: blogData, isLoading: isPostsLoading } = useGetPublicBlogPostsQuery({
    page: currentPage,
    limit: postsPerPage
  });

  if (isConfigLoading || isPostsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  const blogPosts = blogData?.blogs || [];
  const pagination = blogData?.pagination;

  // --- Configuration Extraction ---
  const heroSection = pageConfig?.sections?.find((s: any) => s.type === 'hero');
  const featuredSection = pageConfig?.sections?.find((s: any) => s.type === 'featured-posts');
  const popularSection = pageConfig?.sections?.find((s: any) => s.type === 'popular-posts');

  // --- Category Logic (Dynamic) ---
  const counts = blogPosts.reduce((acc: any, post: any) => {
    acc[post.category] = (acc[post.category] || 0) + 1;
    return acc;
  }, {});

  const categories = Object.entries(counts).map(([name, count]) => ({
    name,
    count: count as number,
    icon: TrendingUp
  }));

  // Determine Featured Post (Config ID > Most Recent)
  const featuredPostId = featuredSection?.content?.featuredPostId;
  const featuredPost = featuredPostId
    ? blogPosts.find((p: any) => p.id === featuredPostId) || blogPosts[0]
    : blogPosts[0];

  // Regular posts (everything except featured)
  const regularPosts = blogPosts.filter((p: any) => p.id !== featuredPost?.id);

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
                      <Link to={`/blog/${featuredPost.slug}`}>
                        <img
                          src={featuredPost.coverImage || "/placeholder.svg"}
                          alt={featuredPost.title}
                          className="w-full h-64 md:h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </Link>
                    </div>
                    <div className="md:w-1/2 p-8 sm:p-10 flex flex-col justify-center">
                      <Badge variant="secondary" className="mb-3 w-fit bg-white/10 text-blue-300 text-xs uppercase tracking-wider font-bold">
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
                          {featuredPost.author || "Admin"}
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {new Date(featuredPost.publishedAt || featuredPost.createdAt).toLocaleDateString()}
                        </div>
                        <span className="hidden sm:inline">5 min read</span>
                      </div>

                      <Link to={`/blog/${featuredPost.slug}`} className="self-start">
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
                  <Link to={`/blog/${post.slug}`} className="block overflow-hidden aspect-video">
                    <img
                      src={post.coverImage || "/placeholder.svg"}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </Link>
                  <div className="p-6">
                    <Badge variant="secondary" className="mb-3 w-fit bg-blue-50 text-blue-600 border-blue-100 uppercase tracking-wider text-[10px] font-bold">
                      {post.category}
                    </Badge>
                    <CardTitle className="leading-tight group-hover:text-blue-600 transition-colors mb-3 text-xl">
                      <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                    </CardTitle>
                    <p className="text-slate-600 mb-4 leading-relaxed line-clamp-3 text-sm">{post.excerpt}</p>

                    <div className="flex items-center gap-4 text-xs text-slate-500 mt-auto pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-blue-500" />
                        {post.author || "Admin"}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Pagination Controls */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-16 pt-8 border-t border-slate-100">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                >
                  Previous
                </Button>

                <div className="flex items-center gap-1">
                  {[...Array(pagination.totalPages)].map((_, i) => (
                    <Button
                      key={i + 1}
                      variant={currentPage === i + 1 ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-10 h-10 rounded-xl font-bold ${currentPage === i + 1
                        ? "bg-blue-600 shadow-md shadow-blue-200"
                        : "text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                        }`}
                    >
                      {i + 1}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === pagination.totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                  className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                >
                  Next
                </Button>
              </div>
            )}
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
              <Card className="rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1 backdrop-blur-sm bg-white/80 border border-white/40 shadow-sm overflow-hidden">
                <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                  <CardTitle className="text-xl font-bold text-slate-900">{popularSection?.content?.title || "Popular This Month"}</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    {/* Popular logic: Manual Selection or First 3 (Auto) */}
                    {(popularSection?.content?.mode === "manual" && Array.isArray(popularSection.content.selectedPosts))
                      ? popularSection.content.selectedPosts
                        .map((id: string) => blogPosts.find((p: any) => p.id === id))
                        .filter((p: any) => p !== undefined)
                        .map((post: any) => (
                          <Link key={post.id} to={`/blog/${post.slug}`} className="flex gap-4 group cursor-pointer items-center">
                            <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded-xl border border-slate-200 shadow-sm">
                              <img
                                src={post.coverImage || "/placeholder.svg"}
                                alt={post.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-slate-800 group-hover:text-blue-600 line-clamp-2 text-sm leading-tight transition-colors">
                                {post.title}
                              </h4>
                              <p className="text-[10px] text-slate-400 mt-1.5 font-bold uppercase tracking-wider">
                                {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </Link>
                        ))
                      : blogPosts.slice(0, 3).map((post: any) => (
                        <Link key={post.id} to={`/blog/${post.slug}`} className="flex gap-4 group cursor-pointer items-center">
                          <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded-xl border border-slate-200 shadow-sm">
                            <img
                              src={post.coverImage || "/placeholder.svg"}
                              alt={post.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-slate-800 group-hover:text-blue-600 line-clamp-2 text-sm leading-tight transition-colors">
                              {post.title}
                            </h4>
                            <p className="text-[10px] text-slate-400 mt-1.5 font-bold uppercase tracking-wider">
                              {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                            </p>
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