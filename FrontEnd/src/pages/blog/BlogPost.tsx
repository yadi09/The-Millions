import React, { useState, useEffect, useRef } from "react"
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

// --- DUMMY DATA ---
const blogPost = {
    id: "2024-tax-changes",
    title: "2024 Tax Changes: What You Need to Know",
    excerpt:
        "Stay ahead of the latest tax changes affecting individuals and businesses in 2024. Our comprehensive guide covers key updates and planning strategies.",
    category: "Tax Tips",
    author: "Sarah Mitchell",
    date: "March 15, 2024",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1554224155-1696413565d3?q=80&w=2070&auto=format&fit=crop",
    featured: true,
    content: `
    <p class="mb-6 text-lg leading-relaxed">The fiscal landscape in 2024 brings significant changes that every taxpayer needs to be aware of. From adjustments in tax brackets to new deductions available for small businesses, understanding these shifts is crucial for effective financial planning.</p>
    
    <h2 id="key-changes-for-individuals" class="text-3xl font-bold text-slate-900 mb-4 mt-12 scroll-mt-24">Key Changes for Individuals</h2>
    <p class="mb-6 text-lg leading-relaxed">One of the most notable updates this year involves the adjustment of standard deductions. Inflation has driven these numbers higher, potentially lowering the taxable income for millions of households. Additionally, there are new credits available for energy-efficient home improvements, which can provide substantial savings.</p>
    
    <h2 id="business-tax-updates" class="text-3xl font-bold text-slate-900 mb-4 mt-12 scroll-mt-24">Business Tax Updates</h2>
    <p class="mb-6 text-lg leading-relaxed">For business owners, the focus shifts towards equipment expensing and digital service taxes. The limits for Section 179 expensing have been increased, allowing businesses to deduct the full purchase price of qualifying equipment immediately. This is a major boon for those looking to invest in new technology or machinery.</p>
    
    <div class="bg-blue-100/50 p-6 rounded-lg border-l-4 border-blue-500 my-8">
      <h3 class="text-lg font-semibold text-blue-900 mb-2">Pro Tip</h3>
      <p class="text-blue-800 leading-relaxed">Consult with a certified tax professional to ensure you are maximizing all available deductions specific to your industry. Early planning can save significant amounts come tax season.</p>
    </div>

    <h2 id="retirement-planning" class="text-3xl font-bold text-slate-900 mb-4 mt-12 scroll-mt-24">Retirement Planning</h2>
    <p class="mb-6 text-lg leading-relaxed">Contribution limits for 401(k) and IRA accounts have also seen an uptick. Increasing your contributions not only secures your future but can also reduce your current taxable income. It's a win-win strategy that should not be overlooked.</p>

    <p class="text-lg leading-relaxed">In conclusion, while tax laws can be complex, staying informed is the first step towards financial empowerment. Review your current financial strategy in light of these changes and make adjustments as necessary to optimize your tax position for 2024.</p>
  `,
}

const relatedPosts = [
    {
        id: "vat-registration-guide",
        title: "VAT Registration: When and How",
        date: "February 20, 2024",
        category: "Tax Tips",
        image: "https://images.unsplash.com/photo-1599582784863-fad474514759?q=80&w=1974&auto=format&fit=crop",
    },
    {
        id: "small-business-growth-planning",
        title: "Small Business Growth: Financial Planning Essentials",
        date: "February 28, 2024",
        category: "Business Growth",
        image: "https://images.unsplash.com/photo-1560518883-ce09059ee353?q=80&w=1974&auto=format&fit=crop",
    },
]

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

const TableOfContents = ({ content, isVisible, onClose }) => {
    const [headings, setHeadings] = useState([])
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

    // In a real app, we would fetch the post based on the slug here
    console.log("Rendering post for slug:", slug)

    return (
        <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 text-slate-800">
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
                                <Badge className="mb-6 bg-blue-100 text-blue-700">{blogPost.category}</Badge>
                                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6 leading-tight">
                                    {blogPost.title}
                                </h1>
                                <div className="flex flex-wrap items-center gap-x-6 gap-y-4 text-slate-500">
                                    <div className="flex items-center gap-2">
                                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold border border-blue-100 uppercase">
                                            {blogPost.author.charAt(0)}
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-semibold text-slate-800 leading-none">{blogPost.author}</p>
                                            <p className="text-xs text-slate-500 mt-1">Financial Expert</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Calendar className="w-4 h-4" />
                                        <span>{blogPost.date}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Clock className="w-4 h-4" />
                                        <span>{blogPost.readTime}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Featured Image */}
                            <div className="rounded-2xl overflow-hidden shadow-2xl mb-12 aspect-video group">
                                <img
                                    src={blogPost.image}
                                    alt={blogPost.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>

                            {/* Article Body */}
                            <article className="prose prose-lg max-w-none text-slate-600 prose-h2:text-slate-900 prose-h2:font-bold prose-h2:text-3xl prose-p:leading-relaxed prose-li:leading-relaxed">
                                <div dangerouslySetInnerHTML={{ __html: blogPost.content }} />
                            </article>

                            {/* Share Footer */}
                            <div className="mt-12 border-t pt-8 flex items-center justify-between flex-wrap gap-4">
                                <p className="font-semibold text-slate-900 text-lg">Share this article</p>
                                <div className="flex gap-3">
                                    <Button variant="outline" size="icon" className="rounded-full hover:text-blue-600 hover:border-blue-600 transition-colors">
                                        <Facebook className="w-5 h-5" />
                                    </Button>
                                    <Button variant="outline" size="icon" className="rounded-full hover:text-sky-500 hover:border-sky-500 transition-colors">
                                        <Twitter className="w-5 h-5" />
                                    </Button>
                                    <Button variant="outline" size="icon" className="rounded-full hover:text-blue-700 hover:border-blue-700 transition-colors">
                                        <Linkedin className="w-5 h-5" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Right Sidebar */}
                        <div className="lg:col-span-4 space-y-8">
                            <TableOfContents content={blogPost.content} isVisible={isTocVisible} onClose={() => setIsTocVisible(false)} />

                            {/* Related Posts in Sidebar */}
                            <Card className="rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1 backdrop-blur-sm bg-white/100 border border-slate-200/60 shadow-sm overflow-hidden lg:sticky lg:top-80">
                                <CardHeader>
                                    <CardTitle className="text-xl font-bold">Related Articles</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {relatedPosts.map((post) => (
                                        <Link key={post.id} to={`/blog/${post.id}`} className="flex gap-4 group items-center">
                                            <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded-lg">
                                                <img
                                                    src={post.image}
                                                    alt={post.title}
                                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-slate-800 group-hover:text-blue-600 line-clamp-2 text-sm leading-tight transition-colors">
                                                    {post.title}
                                                </h4>
                                                <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1 uppercase tracking-wider font-bold">
                                                    <Calendar className="w-3 h-3" />
                                                    {post.date}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                    <Button variant="ghost" className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50 mt-4 group">
                                        View All Posts
                                        <ArrowLeft className="w-4 h-4 ml-2 rotate-180 transition-transform group-hover:translate-x-1" />
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main >
        </div >
    )
}