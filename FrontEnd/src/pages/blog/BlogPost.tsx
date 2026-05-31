import { useState, useEffect, useMemo } from "react"
import { Button } from "../../components/ui/button"
import {
    Calendar,
    ArrowLeft,
    ArrowRight,
    Clock,
    Share2,
    Facebook,
    Twitter,
    Linkedin,
    Link as LinkIcon,
    Menu,
    X,
    ChevronRight,
    Pencil,
} from "lucide-react"
import { Link, useParams } from "react-router-dom"
import { cn } from "../../components/lib/utils"
import {
    useGetPublicBlogPostQuery,
    useGetPublicBlogPostsQuery,
} from "../../features/api/apiSlice"
import { sanitizeHtml } from "../../utils/sanitize"
import { hasToken } from "../../utils/authUtils"
import {
    injectHeadingIds,
    extractHeadings,
    calculateReadingTime,
    formatBlogDate,
    getShareUrls,
    type BlogHeading,
} from "../../utils/blog"

// --- COMPONENTS ---

const ScrollProgressBar = () => {
    const [width, setWidth] = useState(0)

    useEffect(() => {
        const handleScroll = () => {
            const totalScroll = document.documentElement.scrollTop
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
            if (windowHeight <= 0) return
            setWidth((totalScroll / windowHeight) * 100)
        }
        window.addEventListener("scroll", handleScroll, { passive: true })
        handleScroll()
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return <div className="fixed top-0 left-0 z-50 h-[2px] bg-millions-accent" style={{ width: `${width}%` }} />
}

interface TOCProps {
    headings: BlogHeading[];
    isVisible: boolean;
    onClose: () => void;
}

const TableOfContents = ({ headings, isVisible, onClose }: TOCProps) => {
    const [activeId, setActiveId] = useState("")

    useEffect(() => {
        if (!headings.length) return
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) setActiveId(entry.target.id)
                })
            },
            { rootMargin: "0px 0px -75% 0px" }
        )
        headings.forEach((h) => {
            const el = document.getElementById(h.id)
            if (el) observer.observe(el)
        })
        return () => observer.disconnect()
    }, [headings])

    if (!headings.length) return null

    const tocContent = (
        <div className="bg-millions-dark p-8 border-t-2 border-t-millions-accent shadow-xl">
            <h4 className="font-cormorant text-white text-[1rem] font-light mb-8 uppercase tracking-[0.25em] italic">Contents</h4>
            <ul className="space-y-3">
                {headings.map((heading) => (
                    <li key={heading.id} className={cn(heading.level === 3 && "pl-4")}>
                        <a
                            href={`#${heading.id}`}
                            onClick={onClose}
                            className={cn(
                                "flex items-center gap-3 text-[0.75rem] tracking-wide font-light transition-colors",
                                activeId === heading.id
                                    ? "text-millions-accent font-medium"
                                    : "text-white/40 hover:text-millions-accent"
                            )}
                        >
                            <ChevronRight className={cn("w-3 h-3 transition-transform shrink-0", activeId === heading.id && "translate-x-1")} />
                            <span className={cn(heading.level === 3 && "text-[0.7rem]")}>{heading.text}</span>
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    )

    return (
        <>
            <div
                className={cn(
                    "fixed inset-0 z-40 bg-millions-dark/80 backdrop-blur-sm lg:hidden",
                    isVisible ? "block" : "hidden"
                )}
                onClick={onClose}
            ></div>
            <div
                className={cn(
                    "fixed top-0 right-0 h-full w-4/5 max-w-sm bg-millions-dark z-50 p-8 transform transition-transform duration-300 lg:hidden border-l border-white/5 overflow-y-auto",
                    isVisible ? "translate-x-0" : "translate-x-full"
                )}
            >
                <div className="flex items-center justify-between mb-10">
                    <h3 className="font-cormorant text-white text-xl font-light italic">Navigation</h3>
                    <Button variant="ghost" size="icon" onClick={onClose} className="text-white/40 hover:text-millions-accent">
                        <X className="w-5 h-5" />
                    </Button>
                </div>
                {tocContent}
            </div>
            <aside className="hidden lg:block lg:sticky lg:top-24">{tocContent}</aside>
        </>
    )
}

// --- MAIN COMPONENT ---

export default function BlogPost() {
    const { slug } = useParams()
    const [isTocVisible, setIsTocVisible] = useState(false)
    const [copyState, setCopyState] = useState<"idle" | "copied">("idle")

    const { data: blogPost, isLoading, isError } = useGetPublicBlogPostQuery(slug as string)
    // Fetch a wide swath of posts for related-articles + prev/next.
    const { data: archive } = useGetPublicBlogPostsQuery({ page: 1, limit: 100 })

    // Inject anchor IDs into the article HTML and extract a TOC.
    const sanitizedHtml = useMemo(() => {
        if (!blogPost?.content) return ""
        return injectHeadingIds(sanitizeHtml(blogPost.content))
    }, [blogPost?.content])

    const headings = useMemo(() => extractHeadings(sanitizedHtml), [sanitizedHtml])
    const readingTime = useMemo(() => calculateReadingTime(blogPost?.content || ""), [blogPost?.content])

    // Related + adjacency calculations.
    const { relatedPosts, prevPost, nextPost } = useMemo(() => {
        const all = (archive?.blogs ?? []).filter((p: any) => p.slug !== blogPost?.slug)
        const sameCategory = all
            .filter((p: any) => p.category === blogPost?.category)
            .slice(0, 3)
        const fillers = all.filter((p: any) => !sameCategory.find((s: any) => s.slug === p.slug)).slice(0, 3 - sameCategory.length)
        const related = [...sameCategory, ...fillers].slice(0, 3)

        // For prev/next, use chronological order across the full archive.
        const chronological = [...(archive?.blogs ?? [])].sort((a: any, b: any) => {
            const da = new Date(a.publishedAt || a.createdAt).getTime()
            const db = new Date(b.publishedAt || b.createdAt).getTime()
            return db - da // newest first
        })
        const idx = chronological.findIndex((p: any) => p.slug === blogPost?.slug)
        return {
            relatedPosts: related,
            prevPost: idx > 0 ? chronological[idx - 1] : null,        // newer
            nextPost: idx >= 0 && idx < chronological.length - 1 ? chronological[idx + 1] : null, // older
        }
    }, [archive, blogPost])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-millions-light">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-millions-accent border-t-transparent animate-spin mx-auto mb-4" />
                    <span className="text-[0.6rem] font-jost text-millions-muted uppercase tracking-[0.25em]">Loading Article...</span>
                </div>
            </div>
        )
    }

    if (isError || !blogPost) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-millions-light text-center p-4">
                <h2 className="font-cormorant text-[clamp(2rem,4vw,3rem)] text-millions-dark font-light mb-4">Article Not Found</h2>
                <p className="text-millions-body font-light text-[0.9rem] mb-10 max-w-sm">The article you are looking for doesn't exist or has been removed from our archive.</p>
                <Link to="/blog">
                    <button className="bg-millions-dark text-white px-10 py-4 font-jost text-[0.7rem] tracking-[0.2em] uppercase font-bold hover:bg-millions-accent hover:text-millions-dark transition-all">
                        Back to Archive
                    </button>
                </Link>
            </div>
        )
    }

    const isAdmin = hasToken();
    const pageUrl = typeof window !== "undefined" ? window.location.href : ""
    const shareUrls = getShareUrls(blogPost.title, pageUrl)

    const handleCopyLink = async () => {
        if (!navigator?.clipboard) return
        try {
            await navigator.clipboard.writeText(pageUrl)
            setCopyState("copied")
            setTimeout(() => setCopyState("idle"), 1800)
        } catch {
            // ignore
        }
    }

    return (
        <div className="bg-millions-light text-millions-dark font-jost">
            <ScrollProgressBar />

            {/* Admin-only floating action: jump to the post's admin editor. */}
            {isAdmin && blogPost?.id && (
                <Link
                    to={`/admin/blog/edit/${blogPost.id}`}
                    className="fixed bottom-6 right-6 z-[60] flex items-center gap-2 bg-millions-dark text-millions-accent border border-millions-accent/40 px-4 py-3 shadow-2xl hover:bg-millions-accent hover:text-millions-dark transition-colors font-jost text-[0.65rem] uppercase tracking-[0.2em]"
                >
                    <Pencil size={13} />
                    Edit Post
                </Link>
            )}

            {/* Navigation Header */}
            <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-millions-dark/5">
                <div className="max-w-7xl mx-auto px-4 md:px-20">
                    <div className="flex items-center justify-between h-16">
                        <Link to="/blog">
                            <button className="group flex items-center gap-2 text-millions-muted hover:text-millions-accent transition-colors text-[0.7rem] tracking-[0.15em] uppercase font-medium">
                                <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
                                Back to Archive
                            </button>
                        </Link>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden text-millions-muted hover:text-millions-accent rounded-none h-10 w-10"
                            onClick={() => setIsTocVisible(true)}
                            aria-label="Open table of contents"
                        >
                            <Menu className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </header>

            <main className="py-16 md:py-20">
                <div className="max-w-7xl mx-auto px-4 md:px-20">
                    <div className="lg:grid lg:grid-cols-12 lg:gap-16">
                        {/* Main Content */}
                        <div className="lg:col-span-8">
                            {/* Article Header */}
                            <div className="text-left mb-14 animate-fade-in">
                                <span className="text-millions-accent text-[0.6rem] tracking-[0.25em] font-bold uppercase mb-5 inline-block bg-millions-accent/5 px-3 py-1.5">
                                    {blogPost.category}
                                </span>
                                <h1 className="font-cormorant text-[clamp(2rem,5vw,3.5rem)] font-light text-millions-dark mb-8 leading-[1.15]">
                                    {blogPost.title}
                                </h1>
                                <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-millions-muted pb-8 border-b border-millions-dark/5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-millions-dark flex items-center justify-center font-cormorant text-lg text-millions-accent uppercase shrink-0">
                                            {blogPost.author?.charAt(0) || 'A'}
                                        </div>
                                        <div className="text-left">
                                            <p className="text-[0.85rem] font-medium text-millions-dark leading-none">{blogPost.author || 'Team Member'}</p>
                                            <p className="text-[0.6rem] text-millions-muted mt-1.5 uppercase tracking-[0.2em] font-light">Article Author</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-[0.75rem] font-light">
                                        <Calendar className="w-3.5 h-3.5 text-millions-accent" />
                                        <span>{formatBlogDate(blogPost.publishedAt || blogPost.createdAt)}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[0.75rem] font-light">
                                        <Clock className="w-3.5 h-3.5 text-millions-accent" />
                                        <span>{readingTime} min read</span>
                                    </div>
                                </div>

                                {/* Tags */}
                                {blogPost.tags && blogPost.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-6">
                                        {blogPost.tags.map((tag: string) => (
                                            <span
                                                key={tag}
                                                className="text-[0.6rem] text-millions-muted tracking-[0.1em] uppercase px-3 py-1 border border-millions-dark/15 font-light"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Featured Image */}
                            {blogPost.coverImage && (
                                <div className="overflow-hidden shadow-xl mb-14 aspect-video animate-fade-in-up">
                                    <img
                                        src={blogPost.coverImage}
                                        alt={blogPost.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}

                            {/* Article Body */}
                            <article className="prose prose-lg max-w-none text-millions-body
                                prose-headings:text-millions-dark prose-headings:font-cormorant prose-headings:font-light prose-headings:tracking-normal prose-headings:scroll-mt-24
                                prose-h2:text-[clamp(1.5rem,3vw,2.2rem)] prose-h2:mb-6 prose-h2:mt-14 prose-h2:border-l-2 prose-h2:border-l-millions-accent prose-h2:pl-5
                                prose-h3:text-[clamp(1.2rem,2.5vw,1.6rem)] prose-h3:mb-4 prose-h3:mt-10
                                prose-p:leading-[2] prose-p:mb-7 prose-p:text-[1rem] prose-p:font-light prose-p:max-w-[65ch]
                                prose-li:leading-relaxed prose-li:mb-2 prose-li:font-light prose-li:max-w-[65ch]
                                prose-ul:max-w-[65ch] prose-ol:max-w-[65ch]
                                prose-img:shadow-xl
                                prose-strong:text-millions-dark prose-strong:font-medium
                                prose-blockquote:border-l-2 prose-blockquote:border-l-millions-accent prose-blockquote:bg-millions-accent/5 prose-blockquote:p-6 prose-blockquote:italic prose-blockquote:font-cormorant prose-blockquote:text-[1.1rem] prose-blockquote:max-w-[65ch]
                                prose-a:text-millions-accent prose-a:no-underline hover:prose-a:underline
                                ">
                                <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
                            </article>

                            {/* Share */}
                            <div className="mt-20 border-t border-millions-dark/5 pt-10 animate-fade-in-up">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                                    <div className="flex items-center gap-3 text-millions-muted">
                                        <Share2 className="w-4 h-4" />
                                        <span className="text-[0.7rem] font-jost uppercase tracking-[0.2em] font-medium">Share this article</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <a
                                            href={shareUrls.x}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-4 py-2.5 border border-millions-dark/10 text-millions-muted text-[0.65rem] tracking-[0.15em] uppercase font-medium hover:border-millions-accent hover:text-millions-accent transition-all"
                                        >
                                            <Twitter className="w-3.5 h-3.5" />
                                            X / Twitter
                                        </a>
                                        <a
                                            href={shareUrls.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-4 py-2.5 border border-millions-dark/10 text-millions-muted text-[0.65rem] tracking-[0.15em] uppercase font-medium hover:border-millions-accent hover:text-millions-accent transition-all"
                                        >
                                            <Linkedin className="w-3.5 h-3.5" />
                                            LinkedIn
                                        </a>
                                        <a
                                            href={shareUrls.facebook}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-4 py-2.5 border border-millions-dark/10 text-millions-muted text-[0.65rem] tracking-[0.15em] uppercase font-medium hover:border-millions-accent hover:text-millions-accent transition-all"
                                        >
                                            <Facebook className="w-3.5 h-3.5" />
                                            Facebook
                                        </a>
                                        <button
                                            type="button"
                                            onClick={handleCopyLink}
                                            className="flex items-center gap-2 px-4 py-2.5 border border-millions-dark/10 text-millions-muted text-[0.65rem] tracking-[0.15em] uppercase font-medium hover:border-millions-accent hover:text-millions-accent transition-all"
                                        >
                                            <LinkIcon className="w-3.5 h-3.5" />
                                            {copyState === "copied" ? "Copied" : "Copy Link"}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Prev / Next */}
                            {(prevPost || nextPost) && (
                                <nav className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-px bg-millions-dark/5 border-y border-millions-dark/5" aria-label="Adjacent articles">
                                    {prevPost ? (
                                        <Link
                                            to={`/blog/${prevPost.slug}`}
                                            className="group bg-white p-8 flex flex-col gap-2 hover:bg-millions-accent/5 transition-colors"
                                        >
                                            <span className="text-[0.6rem] tracking-[0.25em] uppercase text-millions-muted flex items-center gap-2 group-hover:text-millions-accent transition-colors">
                                                <ArrowLeft className="w-3 h-3" />
                                                Newer Article
                                            </span>
                                            <p className="font-cormorant text-millions-dark text-[1.1rem] font-light leading-snug">{prevPost.title}</p>
                                        </Link>
                                    ) : (
                                        <div className="bg-white p-8 opacity-30" aria-hidden="true" />
                                    )}
                                    {nextPost ? (
                                        <Link
                                            to={`/blog/${nextPost.slug}`}
                                            className="group bg-white p-8 flex flex-col gap-2 hover:bg-millions-accent/5 transition-colors md:text-right"
                                        >
                                            <span className="text-[0.6rem] tracking-[0.25em] uppercase text-millions-muted flex items-center gap-2 md:justify-end group-hover:text-millions-accent transition-colors">
                                                Older Article
                                                <ArrowRight className="w-3 h-3" />
                                            </span>
                                            <p className="font-cormorant text-millions-dark text-[1.1rem] font-light leading-snug">{nextPost.title}</p>
                                        </Link>
                                    ) : (
                                        <div className="bg-white p-8 opacity-30" aria-hidden="true" />
                                    )}
                                </nav>
                            )}
                        </div>

                        {/* Right Sidebar */}
                        <div className="lg:col-span-4 space-y-10 mt-16 lg:mt-0">
                            <TableOfContents headings={headings} isVisible={isTocVisible} onClose={() => setIsTocVisible(false)} />
                        </div>
                    </div>

                    {/* Related Posts */}
                    {relatedPosts.length > 0 && (
                        <section className="mt-24 pt-16 border-t border-millions-dark/5 animate-fade-in-up">
                            <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
                                <div>
                                    <p className="text-millions-accent text-[0.6rem] tracking-[0.25em] uppercase font-bold mb-3">Read Next</p>
                                    <h2 className="font-cormorant text-millions-dark text-[clamp(1.6rem,3vw,2.2rem)] font-light">Related Articles</h2>
                                </div>
                                <Link to="/blog" className="group flex items-center gap-2 text-millions-muted hover:text-millions-accent transition-colors text-[0.7rem] tracking-[0.15em] uppercase font-medium">
                                    Browse Archive
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {relatedPosts.map((post: any) => (
                                    <Link
                                        key={post.id}
                                        to={`/blog/${post.slug}`}
                                        className="group bg-white border-l-2 border-l-transparent hover:border-l-millions-accent hover:shadow-xl transition-all duration-300 flex flex-col"
                                    >
                                        {post.coverImage && (
                                            <div className="overflow-hidden aspect-video">
                                                <img
                                                    src={post.coverImage}
                                                    alt={post.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            </div>
                                        )}
                                        <div className="p-6 flex flex-col flex-1">
                                            <span className="text-millions-accent text-[0.55rem] tracking-[0.25em] font-bold uppercase mb-2">{post.category}</span>
                                            <h3 className="font-cormorant text-millions-dark text-[1.15rem] font-light leading-snug mb-3 group-hover:text-millions-accent transition-colors">
                                                {post.title}
                                            </h3>
                                            <p className="text-millions-body text-[0.78rem] leading-relaxed font-light line-clamp-3 mt-auto">
                                                {post.excerpt}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </main>
        </div>
    )
}
