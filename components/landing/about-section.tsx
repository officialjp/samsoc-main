import { Calendar, Star, Users } from "lucide-react";
import { FeatureCard } from "./feature-card";
import { SectionContainer } from "../section-container";
import { SectionHeading } from "../section-heading";

export function AboutSection() {
  const features = [
    {
      icon: Calendar,
      title: "Weekly Screenings",
      description:
        "Join us every Wednesday for anime screenings. From classics to the latest releases!",
      color: "bg-button1",
    },
    {
      icon: Users,
      title: "Community Events",
      description:
        "Come and hang out with us at one of the multitude of events we run!",
      color: "bg-button2",
    },
    {
      icon: Star,
      title: "Convention Trips",
      description:
        "We organize group trips to both the November and May MCM ComiCon conventions!",
      color: "bg-button3",
    },
  ];

  return (
    <SectionContainer id="about">
      <SectionHeading
        badge="ABOUT US"
        title="What We're All About"
        description="We're a society for all people that love or are interested in the medium of anime. Everyone is welcome!"
        badgeColor="bg-button3"
      />
      <div className="mx-auto max-w-7xl items-center gap-6 py-12 grid lg:grid-cols-3 lg:gap-12">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            color={feature.color}
          />
        ))}
      </div>
    </SectionContainer>
  );
}
