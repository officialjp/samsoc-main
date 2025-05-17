import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MembershipCard } from "@/components/landing/membership-card";

export function MembershipSection() {
  const freeFeatures = [
    { included: true, text: "Access to weekly screenings" },
    { included: true, text: "Participate in society events" },
    { included: true, text: "Join our Discord community" },
    { included: true, text: "Voting rights for anime selections" },
    { included: false, text: "Access to manga library" },
  ];

  const paidFeatures = [
    { included: true, text: "Access to weekly screenings" },
    { included: true, text: "Participate in society events" },
    { included: true, text: "Join our Discord community" },
    { included: true, text: "Voting rights for anime selections" },
    {
      included: true,
      text: "Access to our extensive manga library",
      highlight: true,
    },
  ];

  return (
    <section
      id="join"
      className="w-full py-12 md:py-24 lg:py-32 overflow-hidden"
    >
      <div className="container w-full max-w-full px-4 md:px-6 lg:px-8">
        <div className="relative mx-auto max-w-7xl border-2 md:border-2 border-black bg-white p-4 sm:p-6 md:p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-md">
          <div className="absolute -top-4 -rotate-3 -left-4 md:-top-6 md:-left-6 bg-yellow-300 px-3 md:px-4 py-1 md:py-2 text-lg md:text-xl font-bold border-2 md:border-4 border-black">
            JOIN US!
          </div>
          <div className="space-y-8">
            <h2 className="text-2xl md:text-3xl font-bold text-center">
              Choose Your Membership
            </h2>

            <div className="grid gap-8 md:grid-cols-2">
              <MembershipCard
                title="FREE MEMBERSHIP"
                color="bg-cyan-100"
                price="£0"
                period="Forever free"
                features={freeFeatures}
              />
              <MembershipCard
                title="PAID MEMBERSHIP"
                color="bg-pink-100"
                price="£2 per year"
                period="Satiate your manga reading hunger"
                features={paidFeatures}
                recommended={true}
              />
            </div>
            <div className="md:col-span-2">
              <Button className="w-full bg-pink-500 hover:bg-pink-600 text-white text-base md:text-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                Sign Up Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-500 text-center mt-4">
              By signing up, you agree to our club's terms and conditions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
