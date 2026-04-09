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
        if (confirm("Are you sure you want to delete this architectural note?")) {
            try {
                await deletePost(id).unwrap();
            } catch (err) {
                alert(err instanceof Error ? err.message : "Error deleting post");
            }
        }
    };

    return (
        <div className="space-y-6 md:space-y-12 max-w-6xl mx-auto pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in">
                <div>
                    <h1 className="font-cormorant text-4xl md:text-5xl font-light text-white mb-4 uppercase tracking-widest leading-none">
                        Editorial Sync
                    </h1>
                     <div className="flex items-center gap-4 text-millions-accent text-[0.7rem] tracking-[0.3em] uppercase mb-4 md:mb-0">
                        <div className="w-8 h-[1px] bg-millions-accent" />
                        Manage Architectural Reflections
                    </div>
                </div>
                <Button 
                    onClick={() => navigate('/admin/blog/new')} 
                    className="bg-millions-accent text-millions-dark hover:bg-millions-accent/80 rounded-none uppercase tracking-widest text-[0.7rem] px-8 h-12 transition-all duration-300 font-bold"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    New Refinement
                </Button>
            </div>

            {/* Filters & Search - Glassmorphism */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white/5 p-4 rounded-none border border-white/10 backdrop-blur-md shadow-2xl animate-fade-in-up">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 w-4 h-4" />
                    <Input
                        placeholder="Search refinements..."
                        className="pl-12 w-full h-11 bg-white/5 border-white/5 focus:border-millions-accent/40 rounded-none text-white font-jost text-sm uppercase tracking-widest placeholder:text-white/20 placeholder:normal-case focus:ring-0 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Posts List */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-32 bg-white/5 border border-white/5 rounded-none animate-pulse">
                    <Loader2 className="w-10 h-10 text-millions-accent animate-spin mb-4" />
                    <p className="text-white/40 font-jost uppercase tracking-[0.3em] text-[0.6rem]">Syncing Database...</p>
                </div>
            ) : error ? (
                <div className="text-center py-20 bg-red-400/5 rounded-none border border-red-400/20 text-red-400">
                    <p className="font-cormorant text-xl mb-4 italic font-light opacity-80">Synchronization Interrupted.</p>
                    <Button 
                        variant="outline" 
                        className="bg-transparent border-red-400/40 text-red-400 hover:bg-red-400 hover:text-white rounded-none uppercase text-[0.6rem] tracking-widest" 
                        onClick={() => refetch()}
                    >
                        Retry Sync
                    </Button>
                </div>
            ) : (
                <div className="grid gap-6">
                    {filteredPosts.map((post) => (
                        <BlogCard
                            key={post.id}
                            post={post}
                            onEdit={(id) => navigate(`/admin/blog/edit/${id}`)}
                            onDelete={handleDelete}
                        />
                    ))}

                    {filteredPosts.length === 0 && (
                        <div className="text-center py-24 bg-white/5 rounded-none border border-white/5 border-dashed flex flex-col items-center justify-center">
                            <span className="font-cormorant text-2xl text-white/20 italic mb-2">Architectural Silence.</span>
                            <p className="text-[0.65rem] text-white/20 uppercase tracking-widest font-jost">No matching refinements found.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
