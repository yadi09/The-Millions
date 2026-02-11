import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { ArrowLeft, Save, Loader2, Bold, Italic, List, ListOrdered, Heading1, Heading2, Quote, Undo, Redo, Link as LinkIcon, Upload, X } from "lucide-react";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import {
    useGetBlogPostQuery,
    useCreateBlogPostMutation,
    useUpdateBlogPostMutation,
    useUploadImageMutation
} from "../../features/api/apiSlice";

// --- Types ---
// --- MenuBar Component ---
const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) {
        return null;
    }

    const buttons = [
        {
            icon: <Bold className="w-4 h-4" />,
            action: () => editor.chain().focus().toggleBold().run(),
            isActive: editor.isActive('bold'),
            title: 'Bold',
        },
        {
            icon: <Italic className="w-4 h-4" />,
            action: () => editor.chain().focus().toggleItalic().run(),
            isActive: editor.isActive('italic'),
            title: 'Italic',
        },
        {
            icon: <Heading1 className="w-4 h-4" />,
            action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
            isActive: editor.isActive('heading', { level: 1 }),
            title: 'H1',
        },
        {
            icon: <Heading2 className="w-4 h-4" />,
            action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
            isActive: editor.isActive('heading', { level: 2 }),
            title: 'H2',
        },
        {
            icon: <List className="w-4 h-4" />,
            action: () => editor.chain().focus().toggleBulletList().run(),
            isActive: editor.isActive('bulletList'),
            title: 'Bullet List',
        },
        {
            icon: <ListOrdered className="w-4 h-4" />,
            action: () => editor.chain().focus().toggleOrderedList().run(),
            isActive: editor.isActive('orderedList'),
            title: 'Ordered List',
        },
        {
            icon: <Quote className="w-4 h-4" />,
            action: () => editor.chain().focus().toggleBlockquote().run(),
            isActive: editor.isActive('blockquote'),
            title: 'Quote',
        },
        {
            icon: <LinkIcon className="w-4 h-4" />,
            action: () => {
                const previousUrl = editor.getAttributes('link').href
                const url = window.prompt('URL', previousUrl)
                if (url === null) return // cancelled
                if (url === '') {
                    editor.chain().focus().extendMarkRange('link').unsetLink().run()
                    return
                }
                editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
            },
            isActive: editor.isActive('link'),
            title: 'Link'
        },
        {
            icon: <Undo className="w-4 h-4" />,
            action: () => editor.chain().focus().undo().run(),
            isActive: false,
            title: 'Undo',
        },
        {
            icon: <Redo className="w-4 h-4" />,
            action: () => editor.chain().focus().redo().run(),
            isActive: false,
            title: 'Redo',
        },
    ];

    return (
        <div className="flex flex-wrap gap-1 p-2 border-b bg-gray-50 rounded-t-md">
            {buttons.map((btn, index) => (
                <button
                    key={index}
                    onClick={(e) => { e.preventDefault(); btn.action(); }}
                    className={`p-2 rounded hover:bg-gray-200 transition-colors ${btn.isActive ? 'bg-gray-200 text-black' : 'text-gray-600'
                        }`}
                    title={btn.title}
                >
                    {btn.icon}
                </button>
            ))}
        </div>
    );
};


// --- Mock Categories ---
const EXISTING_CATEGORIES = ["Tax Tips", "Business Growth", "Property", "Technology", "News", "Success Stories"];

// --- Tiptap Extensions ---
const extensions = [
    StarterKit,
    Link.configure({
        openOnClick: false,
        HTMLAttributes: {
            class: 'text-blue-500 underline cursor-pointer',
        }
    }),
];

const BlogEditor = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = Boolean(id);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // RTK Query Hooks
    const { data: post, isLoading: isInitialLoading } = useGetBlogPostQuery(id || '', { skip: !isEditing });
    const [createPost, { isLoading: isCreating }] = useCreateBlogPostMutation();
    const [updatePost, { isLoading: isUpdating }] = useUpdateBlogPostMutation();
    const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();

    const isLoading = isCreating || isUpdating;

    // Form State
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [category, setCategory] = useState("");
    const [coverImage, setCoverImage] = useState("");
    const [excerpt, setExcerpt] = useState("");
    const [author, setAuthor] = useState("");

    // Category Suggestion State
    const [suggestedCategories, setSuggestedCategories] = useState(EXISTING_CATEGORIES);
    const [showSuggestions, setShowSuggestions] = useState(false);


    // Initialize TipTap
    const editor = useEditor({
        extensions,
        content: '',
        editorProps: {
            attributes: {
                // Responsive customization: Mobile -> Tablet -> Desktop
                class: 'prose prose-slate focus:outline-none min-h-[300px] p-4 max-w-none prose-headings:font-bold prose-h1:text-xl md:prose-h1:text-2xl lg:prose-h1:text-3xl prose-h2:text-lg md:prose-h2:text-xl lg:prose-h2:text-2xl prose-h3:text-base md:prose-h3:text-lg lg:prose-h3:text-xl',
            },
        },
    });


    // Sync form with fetched post data
    useEffect(() => {
        if (post) {
            setTitle(post.title || "");
            setSlug(post.slug || "");
            setCategory(post.category || "");
            setCoverImage(post.coverImage || "");
            setExcerpt(post.excerpt || "");
            setAuthor(post.author || "");
            if (editor && editor.isEmpty && post.content) {
                editor.commands.setContent(post.content);
            }
        }
    }, [post, editor]);


    // Auto-generate slug from title
    useEffect(() => {
        if (!isEditing && title) {
            const generatedSlug = title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric with -
                .replace(/^-+|-+$/g, ""); // Trim -
            setSlug(generatedSlug);
        }
    }, [title, isEditing]);

    // Update Category Suggestions based on input
    useEffect(() => {
        if (category) {
            const filtered = EXISTING_CATEGORIES.filter(c =>
                c.toLowerCase().includes(category.toLowerCase()) &&
                c.toLowerCase() !== category.toLowerCase()
            );
            setSuggestedCategories(filtered);
        } else {
            setSuggestedCategories(EXISTING_CATEGORIES);
        }
    }, [category]);


    const handleSave = async (status: "draft" | "published") => {
        if (!editor || !title || !category) {
            alert("Please fill in the title, category and content.");
            return;
        }

        const contentHtml = editor.getHTML();
        const postData = {
            title,
            slug,
            category,
            coverImage,
            excerpt,
            author, // Required by backend
            content: contentHtml,
            status: status.toUpperCase(), // Backend expects DRAFT or PUBLISHED
        };

        try {
            if (isEditing && id) {
                await updatePost({ id, data: postData }).unwrap();
            } else {
                await createPost(postData).unwrap();
            }
            navigate("/admin/blog");
        } catch (err: any) {
            const errorMessage = err?.data?.message || err?.data?.error || "Error saving post";
            alert(errorMessage);
            console.error("Save error:", err);
        }
    };

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        try {
            const result = await uploadImage(formData).unwrap();
            setCoverImage(result.url);
        } catch (err) {
            alert(err instanceof Error ? err.message : "Error uploading image");
        }
    };

    if (isInitialLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-40">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
                <p className="text-slate-500 font-medium text-lg">Loading post data...</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 md:space-y-6 max-w-5xl mx-auto px-3 md:px-0 pb-10 md:pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-center gap-1.5 sm:gap-2">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/admin/blog")} className="h-8 w-8 md:h-10 md:w-10">
                        <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
                    </Button>
                    <div>
                        <h1 className="text-lg md:text-2xl lg:text-3xl font-bold tracking-tight">
                            {isEditing ? "Edit Post" : "New Post"}
                        </h1>
                        <p className="hidden md:block text-[10px] md:text-sm text-muted-foreground line-clamp-1">
                            {isEditing ? "Update your blog post details." : "Create a new article for the blog."}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto justify-end">
                    <Button variant="outline" onClick={() => handleSave("draft")} disabled={isLoading} size="sm" className="flex-1 sm:flex-none text-[11px] sm:text-xs md:text-sm h-8 md:h-9">
                        Save<span className="hidden sm:inline ml-1">Draft</span>
                    </Button>
                    <Button onClick={() => handleSave("published")} disabled={isLoading} size="sm" className="flex-1 sm:flex-none text-[11px] sm:text-xs md:text-sm h-8 md:h-9">
                        {isLoading ? <Loader2 className="w-3 h-3 md:w-4 md:h-4 animate-spin mr-1 md:mr-2" /> : <Save className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />}
                        Publish
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 lg:grid-cols-12 gap-6">
                {/* Main Editor Area - Left/Top */}
                <div className="md:col-span-12 lg:col-span-8 space-y-4 md:space-y-6">
                    <Card>
                        <CardHeader className="p-3 sm:p-4 md:p-6 pb-0 sm:pb-0 md:pb-0">
                            <CardTitle className="text-base md:text-xl">Content</CardTitle>
                        </CardHeader>
                        <CardContent className="p-3 sm:p-4 md:p-6 space-y-4">
                            <div className="space-y-1.5 sm:space-y-2">
                                <Label htmlFor="title" className="text-xs sm:text-sm">Post Title</Label>
                                <Input
                                    id="title"
                                    placeholder="Enter a catchy title..."
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="text-base md:text-lg font-medium h-9 md:h-11"
                                />
                            </div>

                            {/* TipTap Editor */}
                            <div className="space-y-1.5 sm:space-y-2">
                                <Label className="text-xs sm:text-sm">Article Body</Label>
                                <div className="border rounded-md shadow-sm min-h-[300px] md:min-h-[400px] flex flex-col overflow-hidden">
                                    <MenuBar editor={editor} />
                                    <EditorContent editor={editor} className="flex-1 cursor-text" />
                                </div>
                                <p className="text-[10px] md:text-xs text-muted-foreground mt-1">
                                    Use the toolbar above or standard markdown shortcuts (e.g., # for H1, * for bullets).
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="p-3 sm:p-4 md:p-6">
                            <CardTitle className="text-base md:text-xl">Excerpt</CardTitle>
                            <CardDescription className="text-xs md:text-sm">
                                A short summary appearing on the blog list page.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-3 sm:p-4 md:p-6 pt-0 sm:pt-0 md:pt-0">
                            <textarea
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-xs sm:text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Write a brief excerpt..."
                                value={excerpt}
                                onChange={(e) => setExcerpt(e.target.value)}
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Settings - Right/Bottom */}
                <div className="md:col-span-12 lg:col-span-4 space-y-4 md:space-y-6">
                    <Card>
                        <CardHeader className="p-3 sm:p-4 md:p-6">
                            <CardTitle className="text-base md:text-xl">Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="p-3 sm:p-4 md:p-6 pt-0 sm:pt-0 md:pt-0 space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="slug" className="text-xs sm:text-sm">Slug</Label>
                                <Input
                                    id="slug"
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value)}
                                    placeholder="post-url-slug"
                                    className="h-9 md:h-10 text-sm"
                                />
                                <p className="text-[10px] md:text-xs text-muted-foreground">
                                    The URL-friendly version of the title.
                                </p>
                            </div>

                            <div className="space-y-2 relative">
                                <Label htmlFor="category" className="text-xs sm:text-sm">Category</Label>
                                <Input
                                    id="category"
                                    placeholder="Type or select a category..."
                                    value={category}
                                    onChange={(e) => {
                                        setCategory(e.target.value);
                                        setShowSuggestions(true);
                                    }}
                                    onFocus={() => setShowSuggestions(true)}
                                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} // Delay to allow click
                                    className="h-9 md:h-10 text-sm"
                                />
                                {showSuggestions && suggestedCategories.length > 0 && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-40 overflow-y-auto">
                                        {suggestedCategories.map((cat: string) => (
                                            <div
                                                key={cat}
                                                className="px-3 py-1.5 text-xs sm:text-sm cursor-pointer hover:bg-slate-100"
                                                onClick={() => {
                                                    setCategory(cat);
                                                    setShowSuggestions(false);
                                                }}
                                            >
                                                {cat}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                    <span className="text-[10px] md:text-xs text-muted-foreground mr-1">Common:</span>
                                    {EXISTING_CATEGORIES.slice(0, 3).map(cat => (
                                        <Badge
                                            key={cat}
                                            variant="secondary"
                                            className="cursor-pointer hover:bg-blue-100 text-[10px] px-1.5 py-0"
                                            onClick={() => setCategory(cat)}
                                        >
                                            {cat}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="author" className="text-xs sm:text-sm">Author</Label>
                                <Input
                                    id="author"
                                    placeholder="Enter author name..."
                                    value={author}
                                    onChange={(e) => setAuthor(e.target.value)}
                                    className="h-9 md:h-10 text-sm"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="image" className="text-xs sm:text-sm">Featured Image URL</Label>
                                <div className="flex gap-1.5">
                                    <Input
                                        id="image"
                                        value={coverImage}
                                        onChange={(e) => setCoverImage(e.target.value)}
                                        placeholder="https://..."
                                        className="h-9 md:h-10 text-sm"
                                    />
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                    />
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        title="Upload Image"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={isUploading}
                                        className="h-9 w-9 flex-shrink-0"
                                    >
                                        {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                                    </Button>
                                </div>
                            </div>

                            {coverImage && (
                                <div className="mt-3 rounded-md overflow-hidden border aspect-video relative group">
                                    <img
                                        src={coverImage}
                                        alt="Preview"
                                        className="object-cover w-full h-full"
                                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300?text=Invalid+Image+URL'; }}
                                    />
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-1.5 right-1.5 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => setCoverImage("")}
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default BlogEditor;
