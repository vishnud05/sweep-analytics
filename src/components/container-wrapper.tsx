import { cn } from "@/lib/utils"

interface ContainerWrapperProps {
  classname?: string
  children: React.ReactNode
}

const ContainerWrapper = ({ classname, children }: ContainerWrapperProps) => {
  return (
    <div
      className={cn(
        "h-full w-full max-w-screen-xl mx-auto px-2.5 md:px-20",
        classname
      )}
    >
      {children}
    </div>
  )
}
export default ContainerWrapper
