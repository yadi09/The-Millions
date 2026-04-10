import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent } from "../../components/ui/card";
import { ArrowLeft, Save, Loader2, Bold, Italic, List, ListOrdered, Heading1, Heading2, Quote, Undo, Redo, Link as LinkIcon, Upload, X, PenTool, Layout } from "lucide-react";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import {
    useGetBlogPostQuery,
    useCreateBlogPostMutation,
    useUpdateBlogPostMutation,
    useUploadImageMutation
} from "../../features/api/apiSlice";

const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) return null;

    const buttons = [
        { icon: <Bold size={16} />, action: () => editor.chain().focus().toggleBold().run(), isActive: editor.isActive('bold'), title: 'Bold' },
        { icon: <Italic size={16} />, action: () => editor.chain().focus().toggleItalic().run(), isActive: editor.isActive('italic'), title: 'Italic' },
        { icon: <Heading1 size={16} />, action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), isActive: editor.isActive('heading', { level: 1 }), title: 'H1' },
        { icon: <Heading2 size={16} />, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), isActive: editor.isActive('heading', { level: 2 }), title: 'H2' },
        { icon: <List size={16} />, action: () => editor.chain().focus().toggleBulletList().run(), isActive: editor.isActive('bulletList'), title: 'Bullet List' },
        { icon: <ListOrdered size={16} />, action: () => editor.chain().focus().toggleOrderedList().run(), isActive: editor.isActive('orderedList'), title: 'Ordered List' },
        { icon: <Quote size={16} />, action: () => editor.chain().focus().toggleBlockquote().run(), isActive: editor.isActive('blockquote'), title: 'Quote' },
        {
            icon: <LinkIcon size={16} />,
            action: () => {
                const prev = editor.getAttributes('link').href;
                const url = window.prompt('URL', prev);
                if (url === null) return;
                if (url === '') { editor.chain().focus().extendMarkRange('link').unsetLink().run(); return; }
                editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
            },
            isActive: editor.isActive('link'),
            title: 'Link'
        },
        { icon: <Undo size={16} />, action: () => editor.chain().focus().undo().run(), isActive: false, title: 'Undo' },
        { icon: <Redo size={16} />, action: () => editor.chain().focus().redo().run(), isActive: false, title: 'Redo' },
    ];

    return (
        <div className="flex flex-wrap gap-1 p-3 border-b border-white/10 bg-black/20 backdrop-blur-md">
            {buttons.map((btn, idx) => (
                <button
                    key={idx}
                    onClick={(e) => { e.preventDefault(); btn.action(); }}
                    className={`p-2 transition-all duration-200 border border-transparent hover:border-millions-accent/20 ${btn.isActive ? 'bg-millions-accent/10 text-millions-accent border-millions-accent/40' : 'text-white/40 hover:text-white'
                        }`}
                    title={btn.title}
                >
                    {btn.icon}
                </button>
            ))}
        </div>
    );
};

const EXISTING_CATEGORIES = ["Architecture", "Boutique Design", "Market Refinement", "Brand Identity", "Success Analysis", "Technical Insight"];

const extensions = [
    StarterKit,
    Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'text-millions-accent underline decoration-millions-accent/30 underline-offset-4 cursor-pointer hover:text-white transition-colors' }
    }),
];

const BlogEditor = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = Boolean(id);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data: post, isLoading: isInitialLoading } = useGetBlogPostQuery(id || '', { skip: !isEditing });
    const [createPost, { isLoading: isCreating }] = useCreateBlogPostMutation();
    const [updatePost, { isLoading: isUpdating }] = useUpdateBlogPostMutation();
    const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();

    const isLoading = isCreating || isUpdating;

    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [category, setCategory] = useState("");
    const [coverImage, setCoverImage] = useState("");
    const [excerpt, setExcerpt] = useState("");
    const [author, setAuthor] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);

    const editor = useEditor({
        extensions,
        content: '',
        editorProps: {
            attributes: {
                class: 'prose prose-invert focus:outline-none min-h-[400px] p-8 max-w-none prose-headings:font-cormorant prose-headings:font-light prose-headings:tracking-widest prose-h1:text-4xl prose-h2:text-3xl prose-p:font-jost prose-p:text-white/60 prose-p:leading-loose prose-blockquote:border-millions-accent/40 prose-blockquote:bg-millions-accent/5 prose-blockquote:p-6 prose-blockquote:italic selection:bg-millions-accent/20',
            },
        },
    });

    useEffect(() => {
        if (post) {
            setTitle(post.title || "");
            setSlug(post.slug || "");
            setCategory(post.category || "");
            setCoverImage(post.coverImage || "");
            setExcerpt(post.excerpt || "");
            setAuthor(post.author || "");
            if (editor && editor.isEmpty && post.content) { editor.commands.setContent(post.content); }
        }
    }, [post, editor]);

    useEffect(() => {
        if (!isEditing && title) {
            setSlug(title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""));
        }
    }, [title, isEditing]);

    const handleSave = async (status: "draft" | "published") => {
        if (!editor || !title || !category) { alert("Please complete core architectural fields (Title, Category, Content)."); return; }
        const postData = { title, slug, category, coverImage, excerpt, author: author || "Adnan", content: editor.getHTML(), status: status.toUpperCase() };
        try {
            if (isEditing && id) { await updatePost({ id, data: postData }).unwrap(); }
            else { await createPost(postData).unwrap(); }
            navigate("/admin/blog");
        } catch (err: any) { alert(err?.data?.message || "Error syncing architectural note."); }
    };

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('image', file);
        try { const result = await uploadImage(formData).unwrap(); setCoverImage(result.url); }
        catch (err) { alert("Deployment of visual asset failed."); }
    };

    if (isInitialLoading) return (
        <div className="flex flex-col h-[70vh] items-center justify-center animate-pulse">
            <Loader2 className="w-10 h-10 text-millions-accent animate-spin mb-6" />
            <p className="text-white/40 font-jost uppercase tracking-[0.25em] text-xs">Syncing Core Files...</p>
        </div>
    );

    return (
        <div className="space-y-10 max-w-6xl mx-auto px-4 md:px-0 pb-32 animate-fade-in">
            {/* Header Redesign */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 pb-8 border-b border-white/5">
                <div className="flex items-center gap-6">
                    <Button
                        variant="ghost"
                        onClick={() => navigate("/admin/blog")}
                        className="h-14 w-14 rounded-none border border-white/5 hover:border-millions-accent/40 text-white/40 hover:text-millions-accent transition-all"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="font-cormorant text-[clamp(2.2rem,4vw,3rem)] font-light text-white leading-none">
                            {isEditing ? <>Editorial <em className="italic text-millions-accent not-italic">Refinement</em></> : <>New <em className="italic text-millions-accent not-italic">Architectural Note</em></>}
                        </h1>
                        <div className="flex items-center gap-4 text-millions-accent text-[0.65rem] tracking-[0.2em] uppercase mt-4">
                            <div className="w-6 h-[1px] bg-millions-accent/40" />
                            Synchronizing Brand Perspectives
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4 w-full lg:w-auto">
                    <Button
                        variant="outline"
                        onClick={() => handleSave("draft")}
                        className="flex-1 lg:flex-none h-14 bg-transparent border-white/5 text-white/30 hover:border-white/20 rounded-none uppercase text-[0.65rem] tracking-[0.2em] px-8 transition-all"
                    >
                        Save Draft
                    </Button>
                    <Button
                        onClick={() => handleSave("published")}
                        className="flex-1 lg:flex-none h-14 bg-millions-accent text-millions-dark hover:bg-white rounded-none uppercase text-[0.7rem] tracking-[0.2em] font-bold px-10 transition-all shadow-xl"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                        Deploy Note
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Main Workspace */}
                <div className="lg:col-span-8 space-y-10">
                    <Card className="bg-white/5 border-white/5 backdrop-blur-xl rounded-none shadow-2xl p-0 overflow-hidden">
                        <div className="p-8 border-b border-white/5 flex items-center gap-3 bg-white/5">
                            <PenTool className="text-millions-accent w-4 h-4" />
                            <h3 className="text-[0.7rem] font-jost text-white/60 font-bold uppercase tracking-[0.2em]">Manuscript</h3>
                        </div>
                        <CardContent className="p-8 md:p-12 space-y-10">
                            <div className="space-y-3">
                                <Label className="text-[0.6rem] font-jost text-millions-accent/60 uppercase tracking-[0.15em] ml-1">Perspective Title</Label>
                                <Input
                                    placeholder="Enter Architectural Title..."
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="bg-transparent border-none p-0 text-3xl md:text-5xl font-cormorant font-light text-white focus-visible:ring-0 placeholder:text-white/5 h-auto italic"
                                />
                                <div className="h-[1px] w-12 bg-millions-accent/30" />
                            </div>

                            <div className="space-y-4">
                                <Label className="text-[0.6rem] font-jost text-white/20 uppercase tracking-[0.15em] ml-1">Structural Body</Label>
                                <div className="border border-white/5 bg-black/10 rounded-none flex flex-col overflow-hidden group focus-within:border-millions-accent/30 transition-all">
                                    <MenuBar editor={editor} />
                                    <EditorContent editor={editor} className="flex-1 cursor-text custom-prose-scroll" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/5 border-white/5 backdrop-blur-xl rounded-none p-0 shadow-2xl overflow-hidden">
                        <div className="p-8 border-b border-white/5 flex items-center gap-3 bg-white/5">
                            <PenTool className="text-white/20 w-4 h-4" />
                            <h3 className="text-[0.7rem] font-jost text-white/60 font-bold uppercase tracking-[0.2em]">Abstract</h3>
                        </div>
                        <CardContent className="p-8 md:p-12 pt-6">
                            <textarea
                                className="w-full bg-transparent border-none p-0 text-white/60 font-jost italic font-light leading-relaxed text-[0.9rem] focus-within:ring-0 placeholder:text-white/5 resize-none min-h-[100px]"
                                placeholder="Refine the editorial summary for public indexing..."
                                value={excerpt}
                                onChange={(e) => setExcerpt(e.target.value)}
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Metadata Sidebar */}
                <div className="lg:col-span-4 space-y-10">
                    <Card className="bg-white/5 border-white/5 backdrop-blur-xl rounded-none p-0 shadow-2xl overflow-hidden">
                        <div className="p-8 border-b border-white/5 flex items-center gap-3 bg-white/5">
                            <Layout className="text-millions-accent w-4 h-4" />
                            <h3 className="text-[0.7rem] font-jost text-white/60 font-bold uppercase tracking-[0.2em]">Identity Control</h3>
                        </div>
                        <CardContent className="p-8 space-y-8">
                            <div className="space-y-3">
                                <Label className="text-[0.6rem] font-jost text-white/30 uppercase tracking-[0.15em] font-medium">Archival Path (Slug)</Label>
                                <Input
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value)}
                                    className="bg-white/5 border-white/5 text-white/50 font-jost tracking-wider text-xs focus:border-millions-accent/30 rounded-none h-11"
                                />
                            </div>

                            <div className="space-y-3 relative">
                                <Label className="text-[0.6rem] font-jost text-white/30 uppercase tracking-[0.15em] font-medium">Domain Category</Label>
                                <Input
                                    placeholder="SELECT TAXONOMY..."
                                    value={category}
                                    onChange={(e) => { setCategory(e.target.value); setShowSuggestions(true); }}
                                    onFocus={() => setShowSuggestions(true)}
                                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                    className="bg-white/5 border-white/5 text-white/50 font-jost tracking-wider text-xs focus:border-millions-accent/30 rounded-none h-11"
                                />
                                {showSuggestions && (
                                    <div className="absolute z-[60] w-full mt-2 bg-millions-dark border border-white/10 rounded-none shadow-2xl overflow-hidden py-1">
                                        {EXISTING_CATEGORIES.filter(c => c.toLowerCase().includes(category.toLowerCase())).map(cat => (
                                            <div
                                                key={cat}
                                                className="px-6 py-3 text-[0.65rem] text-white/40 uppercase tracking-widest cursor-pointer hover:bg-millions-accent/10 hover:text-millions-accent transition-all font-jost"
                                                onClick={() => setCategory(cat)}
                                            >
                                                {cat}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-3">
                                <Label className="text-[0.6rem] font-jost text-white/30 uppercase tracking-[0.15em] font-medium">Architect (Author)</Label>
                                <Input
                                    placeholder="Mark"
                                    value={author}
                                    onChange={(e) => setAuthor(e.target.value)}
                                    className="bg-white/5 border-white/5 text-white/50 font-jost tracking-wider text-xs focus:border-millions-accent/30 rounded-none h-11"
                                />
                            </div>

                            <div className="space-y-4">
                                <Label className="text-[0.6rem] font-jost text-white/30 uppercase tracking-[0.15em] font-medium">Visual Asset (Cover)</Label>
                                <div className="flex gap-2">
                                    <Input
                                        value={coverImage}
                                        onChange={(e) => setCoverImage(e.target.value)}
                                        className="bg-white/5 border-white/5 text-white/40 font-jost tracking-wider text-[0.6rem] focus:border-millions-accent/30 rounded-none h-11"
                                        placeholder="HTTPS://..."
                                    />
                                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={isUploading}
                                        className="h-11 w-11 bg-white/5 border-white/5 text-white/20 hover:text-millions-accent hover:border-millions-accent/30 rounded-none shrink-0"
                                    >
                                        {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                                    </Button>
                                </div>
                                {coverImage && (
                                    <div className="relative group border border-white/5 p-1 bg-black/20 animate-fade-in-up">
                                        <div className="aspect-[16/10] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                                            <img src={coverImage} alt="Cover Preview" className="object-cover w-full h-full scale-105" />
                                        </div>
                                        <Button variant="ghost" size="icon" className="absolute top-4 right-4 h-8 w-8 bg-black/40 text-white/40 hover:text-red-400 rounded-none" onClick={() => setCoverImage("")}>
                                            <X size={14} />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default BlogEditor;
