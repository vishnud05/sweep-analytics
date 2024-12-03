import { cn } from "@/lib/utils"
import { HTMLAttributes } from "react"

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  contentClassName?: string
}

const Card = ({
  contentClassName,
  children,
  className,
  ...props
}: CardProps) => {
  return (
    <div
      className={cn(
        "relative rounded-lg bg-muted text-card-foreground",
        className
      )}
      {...props}
    >
      <div className={cn("relative z-10 p-6", contentClassName)}>
        {children}
      </div>
      <div className="absolute z-0 inset-px rounded-lg " />
      <div className="pointer-events-none z-0 absolute inset-px rounded-lg shadow-sm ring-1 ring-ring/5" />
    </div>
  )
}
export default Card
