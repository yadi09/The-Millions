import { useState, useMemo } from "react"
import { Search, ArrowRight, User, Calendar, X, ChevronLeft, ChevronRight } from "lucide-react"
import { Link } from "react-router-dom"
import {
  useGetPageQuery,
  useGetPublicBlogPostsQuery,
  useGetBlogCategoriesQuery,
} from "../../features/api/apiSlice"
import { SubPageHero } from "../../components/SubPageHero"
import { formatBlogDate, calculateReadingTime } from "../../utils/blog"
import { cn } from "../../components/lib/utils"

const POSTS_PER_PAGE = 6
// We fetch the full archive client-side so search/filter can run instantly
// across all posts (not just the current paginated slice). Acceptable while
// the archive is in the dozens; if it ever exceeds a few hundred posts,
// server-side filter endpoints would be the right next step.
const ARCHIVE_LIMIT = 200

export default function BlogPage() {
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  const { data: pageConfig } = useGetPageQuery("blog")
  const { data: archive, isLoading: isPostsLoading } = useGetPublicBlogPostsQuery({
    page: 1,
    limit: ARCHIVE_LIMIT,
  })
  const { data: categoriesData } = useGetBlogCategoriesQuery()

  const heroSection = pageConfig?.sections?.find((s: any) => s.type === "hero")

  // Apply filters across the full archive, not just one paginated page.
  const filteredPosts = useMemo(() => {
    const all = archive?.blogs ?? []
    const q = search.trim().toLowerCase()
    return all.filter((post: any) => {
      if (activeCategory && post.category !== activeCategory) return false
      if (!q) return true
      const haystack = [
        post.title,
        post.excerpt,
        post.category,
        post.author,
        ...(Array.isArray(post.tags) ? post.tags : []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
      return haystack.includes(q)
    })
  }, [archive, search, activeCategory])

  // Category counts come from the FULL archive, not the filtered subset, so
  // they don't bounce around as the user types.
  const allCategories = useMemo(() => {
    const all = archive?.blogs ?? []
    const counts: Record<string, number> = {}
    for (const post of all) {
      const c = post.category ?? "Uncategorised"
      counts[c] = (counts[c] || 0) + 1
    }
    // Order: prefer the order returned by /api/blogs/categories if available,
    // otherwise descending count.
    const apiOrder: string[] = Array.isArray(categoriesData) ? categoriesData : []
    const names = Object.keys(counts).sort((a, b) => {
      const ai = apiOrder.indexOf(a)
      const bi = apiOrder.indexOf(b)
      if (ai !== -1 && bi !== -1) return ai - bi
      if (ai !== -1) return -1
      if (bi !== -1) return 1
      return counts[b] - counts[a]
    })
    return names.map((name) => ({ name, count: counts[name] }))
  }, [archive, categoriesData])

  // Featured post only on page 1 + when no filters narrow the set.
  const hasFilters = !!search.trim() || !!activeCategory
  const showFeatured = currentPage === 1 && !hasFilters && filteredPosts.length > 0
  const featuredPost = showFeatured ? filteredPosts[0] : null
  const listPosts = showFeatured ? filteredPosts.slice(1) : filteredPosts

  // Client-side pagination over the filtered set.
  const totalPages = Math.max(1, Math.ceil(listPosts.length / POSTS_PER_PAGE))
  const safePage = Math.min(currentPage, totalPages)
  const pageStart = (safePage - 1) * POSTS_PER_PAGE
  const pagePosts = listPosts.slice(pageStart, pageStart + POSTS_PER_PAGE)

  const onCategoryClick = (name: string) => {
    setActiveCategory((cur) => (cur === name ? null : name))
    setCurrentPage(1)
  }

  const onSearchChange = (val: string) => {
    setSearch(val)
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setSearch("")
    setActiveCategory(null)
    setCurrentPage(1)
  }

  return (
    <main className="min-h-screen bg-millions-light">
      <SubPageHero
        label={heroSection?.content?.badge || "Financial Insights"}
        title={heroSection?.content?.headlineBlack || "Our Knowledge Base"}
        titleEm={heroSection?.content?.headlineBlue || ""}
        subText={
          heroSection?.content?.description ||
          "Stay informed with the latest updates and strategies from our expert team."
        }
      />

      <div className="max-w-7xl mx-auto px-4 md:px-20 py-16 md:py-20">
        {/* Search */}
        <div className="mb-10 animate-fade-in-up">
          <div className="max-w-xl mx-auto relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-millions-accent w-5 h-5" />
            <input
              type="search"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search articles by title, topic, or tag..."
              className="w-full pl-16 pr-12 py-5 bg-white border border-millions-dark/10 shadow-sm focus:border-millions-accent outline-none font-jost text-sm transition-colors"
              aria-label="Search articles"
            />
            {search && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-millions-muted hover:text-millions-dark p-2"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category chips */}
        {allCategories.length > 0 && (
          <div className="mb-14 flex flex-wrap items-center justify-center gap-2 animate-fade-in-up">
            <button
              type="button"
              onClick={clearFilters}
              className={cn(
                "px-4 py-2 text-[0.65rem] font-jost uppercase tracking-[0.2em] transition-colors border",
                !activeCategory && !search
                  ? "bg-millions-dark text-millions-accent border-millions-dark"
                  : "bg-transparent text-millions-muted border-millions-dark/10 hover:border-millions-accent hover:text-millions-accent",
              )}
            >
              All
            </button>
            {allCategories.map((cat) => {
              const isActive = activeCategory === cat.name
              return (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => onCategoryClick(cat.name)}
                  className={cn(
                    "px-4 py-2 text-[0.65rem] font-jost uppercase tracking-[0.2em] transition-colors border flex items-center gap-2",
                    isActive
                      ? "bg-millions-dark text-millions-accent border-millions-dark"
                      : "bg-transparent text-millions-muted border-millions-dark/10 hover:border-millions-accent hover:text-millions-accent",
                  )}
                >
                  {cat.name}
                  <span className={cn("text-[0.55rem]", isActive ? "text-white/60" : "text-millions-muted/60")}>
                    {cat.count}
                  </span>
                </button>
              )
            })}
          </div>
        )}

        {/* Active filter strip */}
        {hasFilters && (
          <div className="mb-10 flex items-center justify-center gap-3 text-[0.7rem] font-jost text-millions-muted">
            <span>
              Showing {filteredPosts.length} {filteredPosts.length === 1 ? "article" : "articles"}
              {activeCategory ? ` in ${activeCategory}` : ""}
              {search ? ` for "${search}"` : ""}
            </span>
            <button
              type="button"
              onClick={clearFilters}
              className="text-millions-accent hover:underline tracking-[0.15em] uppercase text-[0.65rem] font-medium"
            >
              Clear
            </button>
          </div>
        )}

        {/* Skeleton loader */}
        {isPostsLoading ? (
          <BlogSkeleton />
        ) : filteredPosts.length === 0 ? (
          <div className="bg-white/40 backdrop-blur-sm p-16 md:p-24 text-center border-t border-millions-dark/5 animate-fade-in-up">
            <h3 className="font-cormorant text-[clamp(1.5rem,3vw,2.2rem)] text-millions-dark mb-4 italic font-light">
              {hasFilters ? "No matching articles" : "Knowledge Base: Synchronising"}
            </h3>
            <p className="text-millions-body font-light text-[0.9rem] max-w-md mx-auto leading-relaxed mb-8">
              {hasFilters
                ? "We couldn't find any articles that match your filters. Try different keywords or browse all articles."
                : "We are currently preparing high-value financial strategies and technical insights for our archive. Stay tuned for our first publications."}
            </p>
            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="bg-millions-dark text-white px-8 py-3 font-jost text-[0.65rem] tracking-[0.2em] uppercase font-bold hover:bg-millions-accent hover:text-millions-dark transition-all"
              >
                Show all articles
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-16">
            {/* Featured Post */}
            {featuredPost && (
              <FeaturedCard post={featuredPost} />
            )}

            {/* Standard Post Grid */}
            {pagePosts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {pagePosts.map((post: any, idx: number) => (
                  <PostCard key={post.id} post={post} delay={idx} />
                ))}
              </div>
            )}

            {/* Smart pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={safePage}
                totalPages={totalPages}
                onChange={setCurrentPage}
              />
            )}
          </div>
        )}
      </div>
    </main>
  )
}

// ---------------------------------------------------------------------------
// Featured post — wider editorial card.
// ---------------------------------------------------------------------------
function FeaturedCard({ post }: { post: any }) {
  const date = formatBlogDate(post.publishedAt || post.createdAt)
  const readingTime = calculateReadingTime(post.content || "")
  return (
    <article className="animate-fade-in-up">
      <Link
        to={`/blog/${post.slug}`}
        className="group block bg-white border-l-2 border-l-millions-accent shadow-sm hover:shadow-2xl transition-all duration-500"
      >
        <div className="md:flex">
          <div className="md:w-1/2 overflow-hidden aspect-[16/10]">
            {post.coverImage ? (
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-full bg-millions-dark/5" />
            )}
          </div>
          <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-millions-accent text-[0.6rem] tracking-[0.25em] font-bold uppercase">
                Featured
              </span>
              <span className="text-millions-muted/40">·</span>
              <span className="text-millions-muted text-[0.6rem] tracking-[0.25em] uppercase font-medium">
                {post.category}
              </span>
            </div>
            <h2 className="font-cormorant text-millions-dark text-[clamp(1.6rem,3vw,2.2rem)] font-light leading-snug mb-4 group-hover:text-millions-mid transition-colors">
              {post.title}
            </h2>
            <p className="text-millions-body font-light text-[0.9rem] leading-relaxed mb-6 line-clamp-3">
              {post.excerpt}
            </p>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.65rem] text-millions-muted tracking-wider uppercase mb-6">
              <div className="flex items-center gap-1.5">
                <User className="w-3 h-3 text-millions-accent" />
                {post.author || "Admin"}
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3 h-3 text-millions-accent" />
                {date}
              </div>
              <div className="text-millions-muted/70">{readingTime} min read</div>
            </div>

            <div className="flex items-center gap-3 text-millions-dark font-jost text-[0.7rem] tracking-[0.15em] uppercase font-bold group-hover:text-millions-accent transition-colors">
              Read Story
              <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
    </article>
  )
}

// ---------------------------------------------------------------------------
// Standard post card — used in the grid.
// ---------------------------------------------------------------------------
function PostCard({ post, delay }: { post: any; delay: number }) {
  const date = formatBlogDate(post.publishedAt || post.createdAt)
  const readingTime = calculateReadingTime(post.content || "")
  const tags: string[] = Array.isArray(post.tags) ? post.tags : []
  return (
    <article className="animate-fade-in-up" style={{ animationDelay: `${0.06 * delay}s` }}>
      <Link
        to={`/blog/${post.slug}`}
        className="group block bg-white h-full flex flex-col border-l-2 border-l-transparent hover:border-l-millions-accent hover:shadow-xl transition-all duration-300"
      >
        <div className="overflow-hidden aspect-[16/10]">
          {post.coverImage ? (
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-millions-dark/5" />
          )}
        </div>
        <div className="p-6 flex flex-col flex-1">
          <span className="text-millions-accent text-[0.6rem] tracking-[0.25em] font-bold uppercase mb-2">
            {post.category}
          </span>
          <h3 className="font-cormorant text-millions-dark text-[1.15rem] font-light leading-snug mb-3 group-hover:text-millions-accent transition-colors">
            {post.title}
          </h3>
          <p className="text-millions-body font-light text-[0.8rem] leading-relaxed mb-5 line-clamp-3">
            {post.excerpt}
          </p>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-5">
              {tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-[0.55rem] text-millions-muted tracking-[0.1em] uppercase px-2 py-0.5 border border-millions-dark/10 font-light"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-auto flex items-center justify-between border-t border-millions-dark/5 pt-4 text-[0.6rem] text-millions-muted font-light tracking-wide uppercase">
            <div className="flex gap-3">
              <span>{post.author || "Admin"}</span>
              <span className="text-millions-muted/40">·</span>
              <span>{date}</span>
            </div>
            <span className="text-millions-muted/70 normal-case">{readingTime} min</span>
          </div>
        </div>
      </Link>
    </article>
  )
}

// ---------------------------------------------------------------------------
// Pagination — Prev / 1 … current ± 1 … last / Next.
// ---------------------------------------------------------------------------
function Pagination({
  currentPage,
  totalPages,
  onChange,
}: {
  currentPage: number
  totalPages: number
  onChange: (p: number) => void
}) {
  const pages = useMemo(() => {
    const set = new Set<number>([1, totalPages, currentPage, currentPage - 1, currentPage + 1])
    return Array.from(set)
      .filter((n) => n >= 1 && n <= totalPages)
      .sort((a, b) => a - b)
  }, [currentPage, totalPages])

  const renderTokens: Array<number | "…"> = []
  pages.forEach((p, i) => {
    if (i > 0 && p - pages[i - 1] > 1) renderTokens.push("…")
    renderTokens.push(p)
  })

  const goTo = (p: number) => {
    onChange(p)
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <nav className="flex items-center justify-center gap-1 pt-10 border-t border-millions-dark/5" aria-label="Pagination">
      <button
        type="button"
        onClick={() => goTo(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1.5 px-3 h-10 text-[0.7rem] font-jost uppercase tracking-[0.15em] text-millions-muted hover:text-millions-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
        Prev
      </button>
      {renderTokens.map((tok, idx) =>
        tok === "…" ? (
          <span key={`gap-${idx}`} className="w-10 h-10 flex items-center justify-center text-millions-muted/40 text-sm">
            …
          </span>
        ) : (
          <button
            key={tok}
            type="button"
            onClick={() => goTo(tok)}
            className={cn(
              "w-10 h-10 font-jost text-sm transition-all",
              currentPage === tok
                ? "bg-millions-dark text-millions-accent"
                : "text-millions-muted hover:text-millions-accent",
            )}
          >
            {tok}
          </button>
        ),
      )}
      <button
        type="button"
        onClick={() => goTo(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1.5 px-3 h-10 text-[0.7rem] font-jost uppercase tracking-[0.15em] text-millions-muted hover:text-millions-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        Next
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </nav>
  )
}

// ---------------------------------------------------------------------------
// Skeleton loader — visual placeholder while the archive is fetched.
// ---------------------------------------------------------------------------
function BlogSkeleton() {
  return (
    <div className="space-y-16">
      <div className="bg-white border-l-2 border-l-millions-accent shadow-sm">
        <div className="md:flex">
          <div className="md:w-1/2 aspect-[16/10] bg-millions-dark/5 animate-pulse" />
          <div className="md:w-1/2 p-12 space-y-4">
            <div className="h-3 w-24 bg-millions-dark/5 animate-pulse" />
            <div className="h-8 w-full bg-millions-dark/5 animate-pulse" />
            <div className="h-8 w-3/4 bg-millions-dark/5 animate-pulse" />
            <div className="h-3 w-full bg-millions-dark/5 animate-pulse" />
            <div className="h-3 w-2/3 bg-millions-dark/5 animate-pulse" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-white h-full flex flex-col">
            <div className="aspect-[16/10] bg-millions-dark/5 animate-pulse" />
            <div className="p-6 space-y-3">
              <div className="h-2.5 w-20 bg-millions-dark/5 animate-pulse" />
              <div className="h-5 w-full bg-millions-dark/5 animate-pulse" />
              <div className="h-5 w-2/3 bg-millions-dark/5 animate-pulse" />
              <div className="h-3 w-full bg-millions-dark/5 animate-pulse" />
              <div className="h-3 w-4/5 bg-millions-dark/5 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
