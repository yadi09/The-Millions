import { useState, useEffect } from "react"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
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
} from "lucide-react"
import { Link, useParams } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
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

    return <div className="fixed top-0 left-0 z-50 h-1 bg-blue-600" style={{ width: `${width}%` }} />
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
        <Card className="rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1 backdrop-blur-sm bg-white/80 border border-white/40 shadow-sm">
            <CardHeader>
                <CardTitle className="text-xl font-bold">Table of Contents</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="space-y-3">
                    {headings.map((heading) => (
                        <li key={heading.id}>
                            <a
                                href={`#${heading.id}`}
                                onClick={onClose}
                                className={cn(
                                    "font-medium transition-colors hover:text-blue-600",
                                    activeId === heading.id ? "text-blue-600 font-bold" : "text-slate-600"
                                )}
                            >
                                {heading.text}
                            </a>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    )

    return (
        <>
            {/* Mobile TOC */}
            <div
                className={cn(
                    "fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden",
                    isVisible ? "block" : "hidden"
                )}
                onClick={onClose}
            ></div>
            <div
                className={cn(
                    "fixed top-0 right-0 h-full w-4/5 max-w-sm bg-slate-50 z-50 p-6 transform transition-transform duration-300 lg:hidden",
                    isVisible ? "translate-x-0" : "translate-x-full"
                )}
            >
                <div className="flex items-center justify-between mb-8">
                    <h3 className="font-bold text-xl">Table of Contents</h3>
                    <Button variant="ghost" size="icon" onClick={onClose}>
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
        <div className="fixed bottom-6 right-6 z-40">
            <Button
                size="lg"
                className={cn(
                    "rounded-full shadow-lg transition-all duration-300 transform hover:scale-110",
                    isClapped
                        ? "bg-blue-600 text-white"
                        : "bg-white/80 text-slate-700 backdrop-blur-sm border border-white/40"
                )}
                onClick={handleClap}
            >
                <Heart className="w-5 h-5 mr-2" />
                {claps}
            </Button>
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
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    if (isError || !blogPost) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Post Not Found</h2>
                <p className="text-slate-600 mb-8">The article you are looking for doesn't exist or has been removed.</p>
                <Link to="/blog">
                    <Button variant="default">Back to Blog</Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 text-slate-800 font-outfit">
            <ScrollProgressBar />
            <ClapButton />

            {/* Header */}
            <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b border-white/40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link to="/blog">
                            <Button
                                variant="ghost"
                                className="group -ml-2 text-slate-700 hover:bg-slate-200/50"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
                                Back to Blog
                            </Button>
                        </Link>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-slate-500 hover:text-blue-600 hover:bg-slate-200/50"
                            >
                                <Share2 className="w-5 h-5" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="lg:hidden text-slate-500 hover:bg-slate-200/50"
                                onClick={() => setIsTocVisible(true)}
                            >
                                <Menu className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="py-12 sm:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:grid lg:grid-cols-12 lg:gap-12">
                        {/* Main Content */}
                        <div className="lg:col-span-8">
                            {/* Article Header */}
                            <div className="text-left mb-12">
                                <Badge className="mb-6 bg-blue-100/80 text-blue-700 border-none px-4 py-1.5 text-xs font-bold tracking-wider uppercase">
                                    {blogPost.category}
                                </Badge>
                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight">
                                    {blogPost.title}
                                </h1>
                                <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-slate-500">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold border-2 border-white shadow-md uppercase">
                                            {blogPost.author?.charAt(0) || 'A'}
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-bold text-slate-900 leading-none">{blogPost.author || 'Team Member'}</p>
                                            <p className="text-xs text-slate-500 mt-1.5 font-medium uppercase tracking-widest">Article Author</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2.5 text-sm font-medium">
                                        <div className="p-2 rounded-lg bg-blue-100/50 text-blue-600">
                                            <Calendar className="w-4 h-4" />
                                        </div>
                                        <span>{new Date(blogPost.publishedAt || blogPost.createdAt).toLocaleDateString("en-US", {
                                            month: "long",
                                            day: "numeric",
                                            year: "numeric"
                                        })}</span>
                                    </div>
                                    <div className="flex items-center gap-2.5 text-sm font-medium">
                                        <div className="p-2 rounded-lg bg-indigo-100/50 text-indigo-600">
                                            <Clock className="w-4 h-4" />
                                        </div>
                                        <span>5 min read</span>
                                    </div>
                                </div>
                            </div>

                            {/* Featured Image */}
                            {blogPost.coverImage && (
                                <div className="rounded-[2rem] overflow-hidden shadow-2xl mb-12 aspect-video group relative">
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <img
                                        src={blogPost.coverImage}
                                        alt={blogPost.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                </div>
                            )}

                            {/* Article Body */}
                            <article className="prose prose-lg max-w-none text-slate-600 
                                prose-headings:text-slate-900 prose-headings:font-bold prose-headings:tracking-tight
                                prose-h2:text-3xl prose-h2:mb-6 prose-h2:mt-12 prose-h2:scroll-mt-24
                                prose-p:leading-relaxed prose-p:mb-8 prose-p:text-lg
                                prose-li:leading-relaxed prose-li:mb-2
                                prose-img:rounded-2xl prose-img:shadow-xl
                                prose-strong:text-slate-900 prose-strong:font-bold
                                prose-blockquote:border-l-4 prose-blockquote:border-blue-600 prose-blockquote:bg-blue-50/50 prose-blockquote:p-6 prose-blockquote:rounded-r-2xl prose-blockquote:italic
                                ">
                                <div dangerouslySetInnerHTML={{ __html: blogPost.content }} />
                            </article>

                            {/* Share Footer */}
                            <div className="mt-16 border-t border-slate-200/60 pt-10 flex items-center justify-between flex-wrap gap-6 bg-white/40 backdrop-blur-sm p-8 rounded-3xl border border-white/40">
                                <div className="space-y-1">
                                    <p className="font-bold text-slate-900 text-xl tracking-tight">Spread the knowledge</p>
                                    <p className="text-slate-500 text-sm font-medium">Share this article with your network</p>
                                </div>
                                <div className="flex gap-4">
                                    <Button variant="outline" size="lg" className="rounded-2xl hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300 shadow-sm border-slate-200">
                                        <Facebook className="w-5 h-5 mr-2" />
                                        Post
                                    </Button>
                                    <Button variant="outline" size="lg" className="rounded-2xl hover:bg-sky-500 hover:text-white hover:border-sky-500 transition-all duration-300 shadow-sm border-slate-200">
                                        <Twitter className="w-5 h-5 mr-2" />
                                        Tweet
                                    </Button>
                                    <Button variant="outline" size="lg" className="rounded-2xl hover:bg-blue-700 hover:text-white hover:border-blue-700 transition-all duration-300 shadow-sm border-slate-200">
                                        <Linkedin className="w-5 h-5 mr-2" />
                                        Share
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Right Sidebar */}
                        <div className="lg:col-span-4 space-y-10">
                            <TableOfContents content={blogPost.content} isVisible={isTocVisible} onClose={() => setIsTocVisible(false)} />

                            {/* Newsletter / CTA Placeholder */}
                            <Card className="rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-none shadow-xl shadow-blue-200/50 overflow-hidden relative group">
                                <div className="absolute top-0 right-0 -m-8 w-32 h-32 bg-white/10 rounded-full blur-3xl transition-transform duration-500 group-hover:scale-150"></div>
                                <CardHeader className="relative z-10">
                                    <CardTitle className="text-2xl font-bold">Stay Updated</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 relative z-10">
                                    <p className="text-blue-50 text-sm leading-relaxed opacity-90">
                                        Get the latest tax tips and business growth strategies delivered to your inbox every week.
                                    </p>
                                    <div className="space-y-3">
                                        <input
                                            type="email"
                                            placeholder="Your email address"
                                            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder:text-blue-100 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all"
                                        />
                                        <Button className="w-full bg-white text-blue-600 hover:bg-blue-50 rounded-xl font-bold py-6 transition-all shadow-md active:scale-95">
                                            Join Newsletter
                                        </Button>
                                    </div>
                                    <p className="text-[10px] text-blue-200 text-center font-medium uppercase tracking-wider">No spam, unsubscribe anytime.</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main >
        </div >
    )
}