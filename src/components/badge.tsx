import { cn } from "@/lib/utils"

interface BadgeProps {
  className?: string
  children: React.ReactNode
}

const GlassBadge = ({ className, children }: BadgeProps) => {
  return (
    <div className={cn("relative inline-block", className)}>
      <a
        className="relative inline-block px-3 py-1 text-brand-200 font-normal select-none rounded-full 
                    bg-brand-600/20 backdrop-blur-lg text-sm border border-white/20 
                    shadow-lg text-shadow cursor-pointer"
      >
        {children}
        <span
          className="absolute w-6 h-6 -top-3 -right-0.5 -rotate-20 blur-[0.5px]
                       before:content-[''] before:absolute before:w-px before:h-full before:left-3
                       before:bg-gradient-to-b before:from-transparent before:via-white/70 before:to-transparent
                       after:content-[''] after:absolute after:h-px after:w-full after:top-3
                       after:bg-gradient-to-l after:from-transparent after:via-white/70 after:to-transparent
                       group-hover:after:animate-[rotate_3s_ease-in-out]
                       group-hover:before:animate-[rotate_3s_ease-in-out]"
        ></span>
        <div
          className="absolute inset-0 -z-10 rounded-full
                      bg-white/25 backdrop-blur-lg border border-white/20 
                      shadow-lg shadow-[rgba(255,116,0,0.3)]"
        ></div>
      </a>
    </div>
  )
}

export default GlassBadge
