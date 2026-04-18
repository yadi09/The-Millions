import { useParams, useNavigate } from 'react-router-dom';
import PageEditorContent from './components/PageEditorContent';

interface AdminPageEditorProps {
    forcedSlug?: string;
    isStandalone?: boolean;
}

const AdminPageEditor = ({ forcedSlug, isStandalone }: AdminPageEditorProps) => {
    // Get the slug from the URL params (e.g., /admin/pages/home -> slug = "home")
    const { slug: paramSlug } = useParams();
    const navigate = useNavigate();

    const slug = forcedSlug || paramSlug;

    // If no slug, we can't edit anything
    if (!slug) {
        return <div className="p-8 text-white/50 font-jost uppercase tracking-widest">Error: No page slug provided</div>;
    }

    return (
        <div className="h-[calc(100vh-4rem)] -m-4 md:-m-8">
            <PageEditorContent
                slug={slug}
                isStandalone={isStandalone}
                onClose={isStandalone ? undefined : () => navigate('/admin/pages')}
            />
        </div>
    );
};

export default AdminPageEditor;
