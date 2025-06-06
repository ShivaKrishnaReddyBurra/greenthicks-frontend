export default function DeliveryDetailLoading() {
  return (
    <div className="p-4 md:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="mb-6">
        <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4"></div>
        <div className="h-8 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
        <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Loading Skeleton */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="h-6 w-1/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-6"></div>

          {/* Status Section */}
          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700 mb-6">
            <div className="h-5 w-1/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="h-4 w-1/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 w-1/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="mb-6">
            <div className="h-5 w-1/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex">
                  <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded mr-2"></div>
                  <div className="flex-1">
                    <div className="h-4 w-1/3 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
                    <div className="h-3 w-2/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="h-px w-full bg-gray-200 dark:bg-gray-700 my-6"></div>

          {/* Items Table */}
          <div className="mb-6">
            <div className="h-5 w-1/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4"></div>
            <div className="border rounded-md overflow-hidden">
              <div className="h-10 w-full bg-gray-200 dark:bg-gray-700"></div>
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-12 w-full bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700"
                ></div>
              ))}
              <div className="h-16 w-full bg-gray-200 dark:bg-gray-700"></div>
            </div>
          </div>
        </div>

        {/* Sidebar Loading Skeleton */}
        <div className="space-y-6">
          {/* Partner Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="h-6 w-1/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4"></div>
            <div className="flex items-center space-x-4 mb-4">
              <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700"></div>
              <div className="space-y-2">
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
            <div className="space-y-3">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex">
                  <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded mr-2"></div>
                  <div className="flex-1">
                    <div className="h-3 w-1/4 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
                    <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="h-8 w-full bg-gray-200 dark:bg-gray-700 rounded mt-4"></div>
          </div>

          {/* Timeline Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="h-6 w-1/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="relative pl-6 pb-4">
                  <div className="absolute left-0 top-0 h-full w-px bg-gray-200 dark:bg-gray-700"></div>
                  <div className="absolute left-0 top-1 h-2 w-2 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                  <div>
                    <div className="h-4 w-1/3 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
                    <div className="h-3 w-1/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="h-6 w-1/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4"></div>
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
