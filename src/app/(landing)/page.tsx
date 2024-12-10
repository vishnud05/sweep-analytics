import ContainerWrapper from "@/components/container-wrapper"
import { CTAButton } from "@/components/cta-btn"
import Heading from "@/components/heading"
import { Check } from "lucide-react"

const Page = () => {
  return (
    <>
      <section className="relative py-24 sm:py-32 ">
        <div className="absolute -z-10 -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br dark:from-brand-100/20 from-brand-900/60 via-brand-600/20 dark:via-brand-200/10 to-transparent blur-3xl" />

        <ContainerWrapper>
          <div className="relative mx-auto text-center flex flex-col items-center gap-10">
            <Heading>
              <span className="text-muted-foreground">
                Real Time SAAS Insights,{" "}
              </span>
              <br />
              <span className="relative bg-gradient-to-br from-brand-500 to-brand-800 bg-clip-text text-transparent drop-shadow-[0_0_3px_rgba(235,100,0,0.37)]">
                Delivered To Your Discord.
              </span>{" "}
            </Heading>
            <p className="text-base/7 text-muted-foreground max-w-prose text-center text-pretty">
              Sweep is the easiest way to monitor your SaaS. Get instant
              notifications for{" "}
              <span className="font-semibold text-foreground/80">
                Sales, New Users, or any other event
              </span>{" "}
              sent directly to your Discord.
            </p>
            <ul className="space-y-2 text-base/7 text-muted-foreground text-left flex flex-col items-start">
              {[
                "Real-time Discord alerts for critical events",
                "Buy once, use forever",
                "Track sales, new users, or any other event",
              ].map((item, index) => (
                <li key={index} className="flex gap-1.5 items-center text-left">
                  <Check className="size-5 shrink-0 text-brand-700" />
                  {item}
                </li>
              ))}
            </ul>
            <div>
              <CTAButton
                href="/dashboard"
                className="relative z-10 h-14 w-full text-base shadow-lg transition-shadow duration-300 hover:shadow-xl"
              >
                Start Monitoring For Free
              </CTAButton>
            </div>
          </div>
        </ContainerWrapper>
      </section>
      <section className=""></section>
      <section></section>
      <section></section>
    </>
  )
}
export const runtime = "edge"
export default Page
