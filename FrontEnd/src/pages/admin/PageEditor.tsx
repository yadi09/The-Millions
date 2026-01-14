import { useParams, useNavigate } from 'react-router-dom';
import PageEditorContent from './components/PageEditorContent';

const AdminPageEditor = () => {
    // Get the slug from the URL params (e.g., /admin/pages/home -> slug = "home")
    const { slug } = useParams();
    const navigate = useNavigate();

    // If no slug, we can't edit anything
    if (!slug) {
        return <div>Error: No page slug provided</div>;
    }

    return (
        <div className="h-[calc(100vh-4rem)] -m-4 md:-m-8">
            <PageEditorContent
                slug={slug}
                onClose={() => navigate('/admin/pages')}
                isModal={false}
            />
        </div>
    );
};

export default AdminPageEditor;
