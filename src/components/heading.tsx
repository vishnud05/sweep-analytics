import { cn } from "@/lib/utils"
import { HTMLAttributes } from "react"

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  classname?: string
  children: React.ReactNode
}

const Heading = ({ classname, children, ...props }: HeadingProps) => {
  return (
    <h1
      className={cn(
        "text-4xl sm:text-5xl text-pretty font-heading font-semibold tracking-tight text-muted-foreground ",
        classname
      )}
      {...props}
    >
      {children}
    </h1>
  )
}
export default Heading
