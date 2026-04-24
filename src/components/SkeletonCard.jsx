export default function SkeletonCard() {
  return (
    <div className="skeleton" aria-hidden="true">
      <div className="skel-img" />
      <div className="skel-body">
        <div className="skel-line s" />
        <div className="skel-line l" />
        <div className="skel-line m" />
      </div>
    </div>
  )
}
