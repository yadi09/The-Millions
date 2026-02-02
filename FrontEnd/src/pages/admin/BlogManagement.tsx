import { useState } from 'react';
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Eye,
    Calendar,
    FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useGetBlogPostsQuery, useDeleteBlogPostMutation } from '../../features/api/apiSlice';


// Type definition (matching our proposed schema)
interface BlogPost {
    id: string;
    title: string;
    category: string;
    status: 'published' | 'draft';
    author?: string;
    date?: string;
    createdAt: string;
    views?: number;
}


export default function BlogManagement() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");

    // RTK Query hooks
    const { data: posts = [], isLoading, error, refetch } = useGetBlogPostsQuery();
    const [deletePost] = useDeleteBlogPostMutation();

    // Filter posts based on search
    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this post?")) {
            try {
                await deletePost(id).unwrap();
            } catch (err) {
                alert(err instanceof Error ? err.message : "Error deleting post");
            }
        }
    };

    return (
        <div className="space-y-4 md:space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Blog Posts</h1>
                    <p className="text-sm md:text-base text-slate-500 mt-1">Manage your articles, news, and updates.</p>
                </div>
                <Button onClick={() => navigate('/admin/blog/new')} className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto">
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Post
                </Button>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white p-3 sm:p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                        placeholder="Search posts..."
                        className="pl-10 w-full h-9 md:h-10 text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                {/* Additional filters can go here */}
            </div>

            {/* Posts List */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-slate-200 border-dashed">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
                    <p className="text-slate-500 font-medium">Loading your posts...</p>
                </div>
            ) : error ? (
                <div className="text-center py-12 bg-red-50 rounded-xl border border-red-100 text-red-600">
                    <p>Failed to load posts. Please try again.</p>
                    <Button variant="ghost" className="mt-4" onClick={() => refetch()}>Retry</Button>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredPosts.map((post) => (
                        <Card key={post.id} className="hover:shadow-md transition-shadow">
                            <div className="p-3 sm:p-4 md:p-6 flex flex-col md:flex-row md:items-center gap-3 sm:gap-4 md:gap-6">
                                {/* Icon/Image Placeholder - Scale or hide on mobile */}
                                <div className="hidden sm:flex w-10 h-10 md:w-12 md:h-12 rounded-lg bg-blue-50 items-center justify-center flex-shrink-0 text-blue-600">
                                    <FileText className="w-5 h-5 md:w-6 md:h-6" />
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2 sm:mb-3">
                                        <h3 className="font-semibold text-slate-900 text-base md:text-lg leading-snug">
                                            {post.title}
                                        </h3>
                                        <Badge
                                            variant={post.status === 'published' ? 'default' : 'secondary'}
                                            className={`w-fit text-[10px] md:text-xs px-2 py-0.5 whitespace-nowrap ${post.status === 'published'
                                                ? 'bg-green-100 text-green-700 hover:bg-green-100 shadow-none border-green-200'
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-100 shadow-none border-slate-200'
                                                }`}
                                        >
                                            {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-x-3 md:gap-x-4 gap-y-2 text-[11px] sm:text-xs md:text-sm text-slate-500 flex-wrap">
                                        <Badge variant="outline" className="text-[10px] md:text-xs font-normal text-slate-500 bg-slate-50 px-2 py-0.5">
                                            {post.category}
                                        </Badge>
                                        <span className="flex items-center gap-1.5">
                                            <Calendar size={14} className="opacity-70" />
                                            {post.date ? new Date(post.date).toLocaleDateString() : new Date(post.createdAt).toLocaleDateString()}
                                        </span>
                                        {post.views !== undefined && (
                                            <span className="flex items-center gap-1.5">
                                                <Eye size={14} className="opacity-70" />
                                                {post.views}
                                            </span>
                                        )}
                                        <span className="hidden sm:inline-flex items-center gap-1.5">
                                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                                            by {post.author || 'Admin'}
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-end gap-2 border-t md:border-t-0 pt-3 md:pt-0 mt-3 md:mt-0">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => navigate(`/admin/blog/edit/${post.id}`)}
                                        className="flex-1 md:flex-none h-9 md:h-10 text-xs md:text-sm px-3 md:px-4 hover:bg-slate-100"
                                    >
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDelete(post.id)}
                                        title="Delete"
                                        className="h-9 w-9 md:h-10 md:w-10 text-red-500 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}

                    {filteredPosts.length === 0 && (
                        <div className="text-center py-20 bg-white rounded-xl border border-slate-200 border-dashed text-slate-500">
                            No posts found matching your search.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
