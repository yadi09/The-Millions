import { useState, useEffect } from "react"
import { Button } from "../../components/ui/button"
import {
    Calendar,
    ArrowLeft,
    Clock,
    Share2,
    Facebook,
    Twitter,
    Linkedin,
    Heart,
    Menu,
    X,
    ChevronRight,
} from "lucide-react"
import { Link, useParams } from "react-router-dom"
import { cn } from "../../components/lib/utils"
import { useGetPublicBlogPostQuery } from "../../features/api/apiSlice"

// --- COMPONENTS ---

const ScrollProgressBar = () => {
    const [width, setWidth] = useState(0)

    const handleScroll = () => {
        const totalScroll = document.documentElement.scrollTop
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
        const scroll = `${(totalScroll / windowHeight) * 100}`
        setWidth(parseFloat(scroll))
    }

    useEffect(() => {
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return <div className="fixed top-0 left-0 z-50 h-[2px] bg-millions-accent" style={{ width: `${width}%` }} />
}

interface HeadingItem {
    id: string;
    text: string | null;
}

interface TOCProps {
    content: string;
    isVisible: boolean;
    onClose: () => void;
}

const TableOfContents = ({ content, isVisible, onClose }: TOCProps) => {
    const [headings, setHeadings] = useState<HeadingItem[]>([])
    const [activeId, setActiveId] = useState("")

    useEffect(() => {
        const parser = new DOMParser()
        const doc = parser.parseFromString(content, "text/html")
        const foundHeadings = Array.from(doc.querySelectorAll("h2")).map((h) => ({
            id: h.id,
            text: h.textContent,
        }))
        setHeadings(foundHeadings)
    }, [content])

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id)
                    }
                })
            },
            { rootMargin: "0px 0px -80% 0px" }
        )

        headings.forEach((h) => {
            const element = document.getElementById(h.id)
            if (element) {
                observer.observe(element)
            }
        })

        return () => {
            headings.forEach((h) => {
                const element = document.getElementById(h.id)
                if (element) {
                    observer.unobserve(element)
                }
            })
        }
    }, [headings])

    if (!headings.length) return null

    const tocContent = (
        <div className="bg-millions-dark p-8 border-t-2 border-t-millions-accent shadow-xl">
            <h4 className="font-cormorant text-white text-[1rem] font-light mb-8 uppercase tracking-[0.25em] italic">Contents</h4>
            <ul className="space-y-4">
                {headings.map((heading) => (
                    <li key={heading.id}>
                        <a
                            href={`#${heading.id}`}
                            onClick={onClose}
                            className={cn(
                                "flex items-center gap-3 text-[0.75rem] tracking-wider font-light transition-colors uppercase",
                                activeId === heading.id
                                    ? "text-millions-accent font-medium"
                                    : "text-white/40 hover:text-millions-accent"
                            )}
                        >
                            <ChevronRight className={cn("w-3 h-3 transition-transform", activeId === heading.id && "translate-x-1")} />
                            {heading.text}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    )

    return (
        <>
            {/* Mobile TOC */}
            <div
                className={cn(
                    "fixed inset-0 z-40 bg-millions-dark/80 backdrop-blur-sm lg:hidden",
                    isVisible ? "block" : "hidden"
                )}
                onClick={onClose}
            ></div>
            <div
                className={cn(
                    "fixed top-0 right-0 h-full w-4/5 max-w-sm bg-millions-dark z-50 p-8 transform transition-transform duration-300 lg:hidden border-l border-white/5",
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

            {/* Desktop TOC */}
            <aside className="hidden lg:block lg:sticky lg:top-24">{tocContent}</aside>
        </>
    )
}

const ClapButton = () => {
    const [claps, setClaps] = useState(42)
    const [isClapped, setIsClapped] = useState(false)

    const handleClap = () => {
        if (!isClapped) {
            setClaps(claps + 1)
            setIsClapped(true)
        }
    }

    return (
        <div className="fixed bottom-8 right-8 z-40">
            <button
                className={cn(
                    "flex items-center gap-2 px-6 py-3 shadow-2xl transition-all duration-300 transform hover:scale-105 text-[0.75rem] font-jost font-bold tracking-wider uppercase",
                    isClapped
                        ? "bg-millions-accent text-millions-dark"
                        : "bg-millions-dark text-white/60 border border-white/10 hover:border-millions-accent/40 hover:text-millions-accent"
                )}
                onClick={handleClap}
            >
                <Heart className={cn("w-4 h-4", isClapped && "fill-millions-dark")} />
                {claps}
            </button>
        </div>
    )
}

// --- MAIN COMPONENT ---

export default function BlogPost() {
    const { slug } = useParams()
    const [isTocVisible, setIsTocVisible] = useState(false)

    const { data: blogPost, isLoading, isError } = useGetPublicBlogPostQuery(slug as string)

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

    return (
        <div className="bg-millions-light text-millions-dark font-jost">
            <ScrollProgressBar />
            <ClapButton />

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
                        <div className="flex items-center gap-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-millions-muted hover:text-millions-accent rounded-none h-10 w-10"
                            >
                                <Share2 className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="lg:hidden text-millions-muted hover:text-millions-accent rounded-none h-10 w-10"
                                onClick={() => setIsTocVisible(true)}
                            >
                                <Menu className="w-4 h-4" />
                            </Button>
                        </div>
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
                                <span className="text-millions-accent text-[0.6rem] tracking-[0.25em] font-bold uppercase mb-4 inline-block bg-millions-accent/5 px-3 py-1.5">
                                    {blogPost.category}
                                </span>
                                <h1 className="font-cormorant text-[clamp(2rem,5vw,3.5rem)] font-light text-millions-dark mb-8 leading-[1.15]">
                                    {blogPost.title}
                                </h1>
                                <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-millions-muted pb-8 border-b border-millions-dark/5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-millions-dark flex items-center justify-center font-cormorant text-lg text-millions-accent uppercase">
                                            {blogPost.author?.charAt(0) || 'A'}
                                        </div>
                                        <div className="text-left">
                                            <p className="text-[0.85rem] font-medium text-millions-dark leading-none">{blogPost.author || 'Team Member'}</p>
                                            <p className="text-[0.6rem] text-millions-muted mt-1.5 uppercase tracking-[0.2em] font-light">Article Author</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-[0.75rem] font-light">
                                        <Calendar className="w-3.5 h-3.5 text-millions-accent" />
                                        <span>{new Date(blogPost.publishedAt || blogPost.createdAt).toLocaleDateString("en-US", {
                                            month: "long",
                                            day: "numeric",
                                            year: "numeric"
                                        })}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[0.75rem] font-light">
                                        <Clock className="w-3.5 h-3.5 text-millions-accent" />
                                        <span>5 min read</span>
                                    </div>
                                </div>
                            </div>

                            {/* Featured Image */}
                            {blogPost.coverImage && (
                                <div className="overflow-hidden shadow-xl mb-14 aspect-video group relative animate-fade-in-up">
                                    <div className="absolute inset-0 bg-gradient-to-t from-millions-dark/30 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <img
                                        src={blogPost.coverImage}
                                        alt={blogPost.title}
                                        className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                                    />
                                </div>
                            )}

                            {/* Article Body */}
                            <article className="prose prose-lg max-w-none text-millions-body
                                prose-headings:text-millions-dark prose-headings:font-cormorant prose-headings:font-light prose-headings:tracking-normal
                                prose-h2:text-[clamp(1.5rem,3vw,2.2rem)] prose-h2:mb-6 prose-h2:mt-14 prose-h2:scroll-mt-24 prose-h2:border-l-2 prose-h2:border-l-millions-accent prose-h2:pl-5
                                prose-h3:text-[clamp(1.2rem,2.5vw,1.6rem)] prose-h3:mb-4 prose-h3:mt-10
                                prose-p:leading-[1.9] prose-p:mb-8 prose-p:text-[1rem] prose-p:font-light
                                prose-li:leading-relaxed prose-li:mb-2 prose-li:font-light
                                prose-img:shadow-xl
                                prose-strong:text-millions-dark prose-strong:font-medium
                                prose-blockquote:border-l-2 prose-blockquote:border-l-millions-accent prose-blockquote:bg-millions-accent/5 prose-blockquote:p-6 prose-blockquote:italic prose-blockquote:font-cormorant prose-blockquote:text-[1.1rem]
                                prose-a:text-millions-accent prose-a:no-underline hover:prose-a:underline
                                ">
                                <div dangerouslySetInnerHTML={{ __html: blogPost.content }} />
                            </article>

                            {/* Share Footer */}
                            <div className="mt-20 border-t border-millions-dark/5 pt-12 animate-fade-in-up">
                                <div className="bg-white p-10 border border-millions-dark/5 shadow-sm">
                                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                                        <div className="space-y-2">
                                            <p className="font-cormorant text-millions-dark text-2xl font-light">Spread the knowledge</p>
                                            <p className="text-millions-muted text-[0.75rem] font-light tracking-wide">Share this article with your network</p>
                                        </div>
                                        <div className="flex gap-3">
                                            <button className="flex items-center gap-2 px-6 py-3 border border-millions-dark/10 text-millions-muted text-[0.65rem] tracking-[0.15em] uppercase font-medium hover:border-millions-accent hover:text-millions-accent transition-all">
                                                <Facebook className="w-4 h-4" />
                                                Post
                                            </button>
                                            <button className="flex items-center gap-2 px-6 py-3 border border-millions-dark/10 text-millions-muted text-[0.65rem] tracking-[0.15em] uppercase font-medium hover:border-millions-accent hover:text-millions-accent transition-all">
                                                <Twitter className="w-4 h-4" />
                                                Tweet
                                            </button>
                                            <button className="flex items-center gap-2 px-6 py-3 border border-millions-dark/10 text-millions-muted text-[0.65rem] tracking-[0.15em] uppercase font-medium hover:border-millions-accent hover:text-millions-accent transition-all">
                                                <Linkedin className="w-4 h-4" />
                                                Share
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Sidebar */}
                        <div className="lg:col-span-4 space-y-10 mt-16 lg:mt-0">
                            <TableOfContents content={blogPost.content} isVisible={isTocVisible} onClose={() => setIsTocVisible(false)} />

                            {/* Newsletter CTA */}
                            <div className="bg-millions-dark p-8 border-t-2 border-t-millions-accent text-center shadow-xl">
                                <h4 className="font-cormorant text-white text-xl font-light mb-4">Stay Informed</h4>
                                <p className="text-white/40 text-[0.75rem] font-light leading-relaxed mb-6">
                                    Get the latest tax tips and business growth strategies delivered to your inbox.
                                </p>
                                <div className="space-y-3">
                                    <input
                                        type="email"
                                        placeholder="Your email address"
                                        className="w-full bg-white/5 border border-white/10 p-3 text-xs text-white outline-none focus:border-millions-accent transition-all placeholder:text-white/20"
                                    />
                                    <button className="w-full bg-millions-accent text-millions-dark py-3 font-jost text-[0.7rem] font-bold uppercase tracking-[0.2em] hover:bg-white transition-all">
                                        Subscribe
                                    </button>
                                </div>
                                <p className="text-[0.55rem] text-white/20 mt-4 uppercase tracking-[0.2em]">No spam, unsubscribe anytime.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}