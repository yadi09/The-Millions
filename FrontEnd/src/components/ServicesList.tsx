import { useGetPageQuery } from '../features/api/apiSlice';

const ServicesList = () => {
    const { data: pageData, error, isLoading } = useGetPageQuery('services');
    // Extract services or use empty array
    const services = pageData?.sections?.find((s: any) => s.content?.services)?.content?.services || [];

    if (isLoading) return <div className="p-4">Loading services...</div>;
    if (error) return <div className="p-4 text-red-500">Error fetching services: {'status' in error ? error.status : error.message}</div>;

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Services List</h2>
            <ul className="list-disc pl-5">
                {services && services.length > 0 ? (
                    services.map((service: any) => (
                        <li key={service.id || Math.random()} className="mb-2">
                            {service.name || JSON.stringify(service)}
                        </li>
                    ))
                ) : (
                    <li>No services found.</li>
                )}
            </ul>
        </div>
    );
};

export default ServicesList;
