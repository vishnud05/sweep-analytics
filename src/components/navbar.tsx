import Link from "next/link"
import ContainerWrapper from "./container-wrapper"
import Image from "next/image"
import { SignOutButton } from "@clerk/nextjs"
import { Button, buttonVariants } from "./ui/button"
import { ArrowRight, LogInIcon, LogOutIcon } from "lucide-react"
import { ModeToggle } from "./theme-toggle"
import { currentUser } from "@clerk/nextjs/server"

const Navbar = async () => {
  const user = await currentUser()

  return (
    <div className="sticky z-[100] h-16 inset-x-0 top-0 w-full border-b border-border bg-secondary-background/80 backdrop-blur-lg transition-all">
      <ContainerWrapper>
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="flex z-40 font-semibold justify-center items-center "
          >
            <Image src="/logo.png" width={56} height={52} alt="logo" />
            <span className="text-brand-600 font-mono text-3xl">SweeP</span>
          </Link>

          <div className="h-full flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  href={"/dashboard"}
                  className={buttonVariants({
                    size: "sm",
                    variant: "default",
                    className: "flex gap-2 ",
                  })}
                >
                  Dashboard
                  <ArrowRight className="size-4 shrink-0" />
                </Link>
                <SignOutButton>
                  <Button variant={"secondary"} size={"sm"}>
                    Sign Out
                    <LogOutIcon className="size-4 shrink-0 text-foreground/60" />
                  </Button>
                </SignOutButton>
              </>
            ) : (
              <>
                <Link
                  href={"/pricing"}
                  className={buttonVariants({
                    size: "sm",
                    variant: "ghost",
                    className: "flex gap-2 ",
                  })}
                >
                  Pricing
                </Link>
                <Link
                  href={"/sign-up"}
                  className={buttonVariants({
                    size: "sm",
                    variant: "secondary",
                    className: "flex gap-2 ",
                  })}
                >
                  Sign Up
                  <LogInIcon className="size-4 shrink-0" />
                </Link>

                <div className="w-px h-8 bg-gray-200 dark:bg-gray-700"></div>

                <Link
                  href={"/sign-in"}
                  className={buttonVariants({
                    size: "sm",
                    variant: "default",
                    className: "flex gap-2 ",
                  })}
                >
                  Sign In
                  <ArrowRight className="size-4 shrink-0" />
                </Link>
              </>
            )}
            <ModeToggle />
          </div>
        </div>
      </ContainerWrapper>
    </div>
  )
}
export default Navbar
