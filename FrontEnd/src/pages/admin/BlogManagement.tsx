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
import { toast } from 'sonner';
import { ConfirmModal } from '../../components/ui/ConfirmModal';

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

    const [deleteId, setDeleteId] = useState<string | null>(null);

    const handleDelete = (id: string) => {
        setDeleteId(id);
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        try {
            await deletePost(deleteId).unwrap();
            toast.success('Architectural note removed.');
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Error deleting post');
        }
    };

    return (
        <div className="space-y-6 sm:space-y-8 md:space-y-10 max-w-6xl mx-auto pb-12 sm:pb-16 md:pb-20">
            {/* Header Section — title + "New" button share a row at every viewport;
                the button is icon-only on mobile so the title gets full width. */}
            <div className="flex items-start sm:items-center justify-between gap-3 sm:gap-6 animate-fade-in">
                <div className="flex-1 min-w-0">
                    <h1 className="font-cormorant text-[clamp(1.85rem,6vw,3.5rem)] font-light text-white mb-3 sm:mb-4 leading-none break-words">
                        Editorial <em className="italic text-millions-accent not-italic">Sync</em>
                    </h1>
                    <div className="flex items-center gap-3 sm:gap-4 text-millions-accent text-[0.6rem] sm:text-[0.7rem] tracking-[0.2em] uppercase">
                        <div className="w-6 sm:w-8 h-[1px] bg-millions-accent/40" />
                        <span className="hidden xs:inline sm:inline">Manage Architectural Reflections</span>
                        <span className="xs:hidden sm:hidden">Architectural Reflections</span>
                    </div>
                </div>
                <Button
                    onClick={() => navigate('/admin/blog/new')}
                    title="New Refinement"
                    className="bg-millions-accent text-millions-dark hover:bg-white rounded-none uppercase tracking-[0.2em] text-[0.65rem] h-11 sm:h-12 px-3 sm:px-8 transition-all duration-300 font-bold shrink-0"
                >
                    <Plus className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">New Refinement</span>
                </Button>
            </div>

            {/* Filters & Search — glassmorphism, more compact on mobile */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white/5 p-3 sm:p-4 rounded-none border border-white/5 backdrop-blur-md shadow-sm animate-fade-in-up">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 w-4 h-4" />
                    <Input
                        placeholder="Search refinements..."
                        className="pl-12 w-full h-11 bg-white/5 border-white/5 focus:border-millions-accent/30 rounded-none text-white font-jost text-[0.8rem] tracking-wider placeholder:text-white/10 placeholder:tracking-normal focus:ring-0 transition-all font-light"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Posts List */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-16 sm:py-24 md:py-32 bg-white/5 border border-white/5 rounded-none animate-pulse">
                    <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 text-millions-accent animate-spin mb-4" />
                    <p className="text-white/40 font-jost uppercase tracking-[0.3em] text-[0.55rem] sm:text-[0.6rem]">Syncing Database...</p>
                </div>
            ) : error ? (
                <div className="text-center py-12 sm:py-16 md:py-20 px-4 bg-red-400/5 rounded-none border border-red-400/20 text-red-400">
                    <p className="font-cormorant text-lg sm:text-xl mb-4 italic font-light opacity-80">Synchronization Interrupted.</p>
                    <Button
                        variant="outline"
                        className="bg-transparent border-red-400/40 text-red-400 hover:bg-red-400 hover:text-white rounded-none uppercase text-[0.6rem] tracking-widest"
                        onClick={() => refetch()}
                    >
                        Retry Sync
                    </Button>
                </div>
            ) : (
                <div className="grid gap-4 sm:gap-6">
                    {filteredPosts.map((post) => (
                        <BlogCard
                            key={post.id}
                            post={post}
                            onEdit={(id) => navigate(`/admin/blog/edit/${id}`)}
                            onDelete={handleDelete}
                        />
                    ))}

                    {filteredPosts.length === 0 && (
                        <div className="text-center py-12 sm:py-16 md:py-24 px-4 bg-white/5 rounded-none border border-white/5 border-dashed flex flex-col items-center justify-center">
                            <span className="font-cormorant text-xl sm:text-2xl text-white/20 italic mb-2">Architectural Silence.</span>
                            <p className="text-[0.6rem] sm:text-[0.65rem] text-white/20 uppercase tracking-widest font-jost">No matching refinements found.</p>
                        </div>
                    )}
                </div>
            )}

            <ConfirmModal
                isOpen={deleteId !== null}
                onClose={() => setDeleteId(null)}
                onConfirm={confirmDelete}
                title="Delete Architectural Note"
                message="Are you sure you want to permanently delete this post? This action cannot be undone."
                confirmText="Delete Post"
            />
        </div>
    );
}
