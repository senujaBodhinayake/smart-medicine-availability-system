import PropTypes from 'prop-types'

function SkeletonLine({ w = 'w-full', h = 'h-4' }) {
  return <div className={`skeleton rounded-md ${w} ${h}`} />
}

SkeletonLine.propTypes = { w: PropTypes.string, h: PropTypes.string }

/** Animated skeleton card that mirrors MedicineCard dimensions */
function LoadingSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-card p-5 flex flex-col gap-3 animate-pulse">
      <div className="flex justify-between items-start">
        <SkeletonLine w="w-2/3" h="h-5" />
        <div className="skeleton rounded-lg w-10 h-10" />
      </div>
      <SkeletonLine w="w-1/3" h="h-3" />
      <SkeletonLine w="w-1/2" h="h-3" />
      <div className="flex gap-2 mt-1">
        <SkeletonLine w="w-20" h="h-6" />
        <SkeletonLine w="w-16" h="h-6" />
      </div>
      <div className="flex gap-2 mt-2">
        <SkeletonLine w="w-full" h="h-9" />
        <SkeletonLine w="w-full" h="h-9" />
      </div>
    </div>
  )
}

export default LoadingSkeleton
