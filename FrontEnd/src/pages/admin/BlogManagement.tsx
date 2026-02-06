import { useState } from 'react';
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
    Plus,
    Search
} from 'lucide-react';
import { BlogCard } from './components/BlogCard';
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
                        <BlogCard
                            key={post.id}
                            post={post}
                            onEdit={(id) => navigate(`/admin/blog/edit/${id}`)}
                            onDelete={handleDelete}
                        />
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
