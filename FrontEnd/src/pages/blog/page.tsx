import { useState } from "react"
import { Search, TrendingUp, Loader2, ArrowRight, User, Calendar } from "lucide-react"
import { Link } from "react-router-dom"
import { useGetPageQuery, useGetPublicBlogPostsQuery } from "../../features/api/apiSlice"
import { SubPageHero } from "../../components/SubPageHero"

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
      <div className="min-h-screen flex items-center justify-center bg-millions-light">
        <Loader2 className="w-12 h-12 animate-spin text-millions-accent" />
      </div>
    );
  }

  const blogPosts = blogData?.blogs || [];
  const pagination = blogData?.pagination;

  // --- Configuration Extraction ---
  const heroSection = pageConfig?.sections?.find((s: any) => s.type === 'hero');

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

  const featuredPost = blogPosts[0];
  const regularPosts = blogPosts.slice(1);

  return (
    <main className="min-h-screen bg-millions-light">
      <SubPageHero 
        label={heroSection?.content?.badge || "Financial Insights"} 
        title={heroSection?.content?.headlineBlack || "Our Knowledge Base"} 
        subText={heroSection?.content?.description || "Stay informed with the latest updates and strategies from our expert team."}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-20 py-20">
        {/* Search Bar Block */}
        <div className="mb-20 animate-fade-in-up">
          <div className="max-w-xl mx-auto relative group">
            <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-millions-accent w-5 h-5 group-focus-within:scale-110 transition-transform" />
            <input 
              placeholder="Search for articles, e.g., 'tax changes'"
              className="w-full pl-16 pr-8 py-5 rounded-none bg-white border border-millions-dark/10 shadow-sm focus:border-millions-accent outline-none font-jost text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-16">
          {/* Main Blog Feed */}
          <div className="lg:col-span-3 space-y-16">
            {blogPosts.length === 0 ? (
              <div className="bg-white p-20 text-center border border-millions-dark/5 animate-fade-in-up">
                <TrendingUp className="w-12 h-12 text-millions-accent/20 mx-auto mb-6" />
                <h3 className="font-cormorant text-2xl text-millions-dark mb-4">Knowledge Base: Coming Soon</h3>
                <p className="text-millions-body font-light max-w-md mx-auto">
                  We are currently preparing high-value financial strategies and technical insights for our archive. Stay tuned for our first publications.
                </p>
              </div>
            ) : (
              <>
                {/* Featured Post Highlight */}
                {featuredPost && (
                  <div className="animate-fade-in-up">
                    <div className="bg-white border-l-4 border-l-millions-accent overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.04)] group">
                      <div className="md:flex h-full">
                        <div className="md:w-1/2 overflow-hidden">
                          <Link to={`/blog/${featuredPost.slug}`}>
                            <img
                              src={featuredPost.coverImage || "/placeholder.svg"}
                              alt={featuredPost.title}
                              className="w-full h-80 md:h-full object-cover grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                            />
                          </Link>
                        </div>
                        <div className="md:w-1/2 p-10 flex flex-col justify-center">
                          <span className="text-millions-accent text-[0.6rem] tracking-[0.2em] font-bold uppercase mb-3 inline-block">
                            Featured | {featuredPost.category}
                          </span>
                          <h2 className="font-cormorant text-millions-dark text-3xl font-light mb-4 group-hover:text-millions-mid transition-colors">
                            {featuredPost.title}
                          </h2>
                          <p className="text-millions-body font-light text-[0.87rem] leading-relaxed mb-6 line-clamp-3">
                            {featuredPost.excerpt}
                          </p>
                          
                          <div className="flex items-center gap-6 text-[0.65rem] text-millions-muted tracking-wider uppercase mb-8">
                            <div className="flex items-center gap-2"><User className="w-3 h-3"/>{featuredPost.author || "Admin"}</div>
                            <div className="flex items-center gap-2"><Calendar className="w-3 h-3"/>{new Date(featuredPost.publishedAt || featuredPost.createdAt).toLocaleDateString()}</div>
                          </div>

                          <Link to={`/blog/${featuredPost.slug}`} className="group/btn flex items-center gap-3 text-millions-dark font-jost text-[0.7rem] tracking-[0.15em] uppercase font-bold hover:text-millions-accent transition-colors">
                            Read Story <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform"/>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Standard Post Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {regularPosts.map((post, idx) => (
                    <div key={post.id} className="animate-fade-in-up" style={{ animationDelay: `${0.1 * idx}s` }}>
                      <div className="group bg-white p-6 border-b-2 border-b-transparent hover:border-b-millions-accent hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                        <Link to={`/blog/${post.slug}`} className="block overflow-hidden aspect-video mb-6">
                          <img
                            src={post.coverImage || "/placeholder.svg"}
                            alt={post.title}
                            className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                          />
                        </Link>
                        <span className="text-millions-accent text-[0.6rem] tracking-[0.2em] font-bold uppercase mb-2">
                          {post.category}
                        </span>
                        <h3 className="font-cormorant text-millions-dark text-xl font-light mb-4 group-hover:text-millions-accent transition-colors leading-snug">
                          <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                        </h3>
                        <p className="text-millions-body font-light text-[0.82rem] leading-relaxed mb-6 line-clamp-2">
                          {post.excerpt}
                        </p>
                        
                        <div className="mt-auto flex items-center justify-between border-t border-millions-dark/5 pt-4">
                          <div className="flex gap-4 text-[0.6rem] text-millions-muted font-light uppercase italic">
                            <span>{post.author || "Admin"}</span>
                            <span>{new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</span>
                          </div>
                          <Link to={`/blog/${post.slug}`} className="text-millions-accent">
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Simple Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center gap-4 pt-10 border-t border-millions-dark/5">
                {[...Array(pagination.totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 font-jost text-sm transition-all ${currentPage === i+1 ? 'bg-millions-dark text-white' : 'text-millions-muted hover:text-millions-accent'}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-12 animate-fade-in-up md:animation-delay-500">
            {/* Categories Block */}
            <div className="bg-white p-8 border-t-2 border-t-millions-mid">
              <h4 className="font-cormorant text-millions-dark text-xl font-light mb-6 uppercase tracking-widest text-[0.9rem]">Insights By Category</h4>
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li key={category.name}>
                    <Link to="#" className="flex justify-between items-center py-2 text-[0.8rem] group text-millions-body hover:text-millions-accent transition-colors font-light">
                      <span>{category.name}</span>
                      <span className="text-[0.6rem] bg-millions-dark/5 px-2 py-1 group-hover:bg-millions-accent group-hover:text-millions-dark transition-colors">{category.count}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter Simple */}
            <div className="bg-millions-dark p-8 border-t-2 border-t-millions-accent text-center">
              <h4 className="font-cormorant text-white text-xl font-light mb-4">Stay Informed</h4>
              <p className="text-white/40 text-[0.75rem] font-light leading-relaxed mb-6">
                Receive curated financial strategies directly in your inbox.
              </p>
              <input 
                placeholder="Your email address" 
                className="w-full bg-white/5 border border-white/10 p-3 text-xs text-white outline-none focus:border-millions-accent mb-4" 
              />
              <button className="w-full bg-millions-accent text-millions-dark py-3 font-jost text-[0.7rem] font-bold uppercase tracking-widest hover:bg-white transition-all">
                Subscribe
              </button>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}