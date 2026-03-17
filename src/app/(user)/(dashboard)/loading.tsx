export default function Loading() {
    return (
        <div className="flex flex-col gap-6 animate-pulse p-4 md:p-8">
            {/* Skeleton for Header/Title */}
            <div className="h-8 w-64 bg-gray-200 rounded-lg"></div>

            {/* Skeleton for main content area */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="h-32 bg-gray-200 rounded-2xl"></div>
                <div className="h-32 bg-gray-200 rounded-2xl"></div>
                <div className="h-32 bg-gray-200 rounded-2xl"></div>
            </div>

            <div className="h-96 bg-gray-200 rounded-2xl w-full"></div>
        </div>
    );
}
