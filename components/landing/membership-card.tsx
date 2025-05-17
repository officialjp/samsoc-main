import { ChevronRight } from "lucide-react";

interface MembershipFeature {
  included: boolean;
  text: string;
  highlight?: boolean;
}

interface MembershipCardProps {
  title: string;
  color: string;
  price: string;
  period: string;
  features: MembershipFeature[];
  recommended?: boolean;
}

export function MembershipCard({
  title,
  color,
  price,
  period,
  features,
  recommended = false,
}: MembershipCardProps) {
  return (
    <div
      className={`border-2 border-black p-6 ${color} rounded-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative`}
    >
      {recommended && (
        <div className="absolute -top-4 -right-4 bg-yellow-300 px-3 py-1 text-sm font-bold border-2 border-black rotate-6">
          RECOMMENDED
        </div>
      )}
      <div className="bg-white px-4 py-2 text-xl font-bold border-2 border-black inline-block -mt-10 mb-4">
        {title}
      </div>
      <div className="space-y-4">
        <p className="text-gray-700">Join our community with basic access:</p>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <ChevronRight
                className={`mr-2 h-4 w-4 ${
                  feature.included ? "text-green-500" : "text-red-500"
                }`}
              />
              <span
                className={`${!feature.included ? "line-through" : ""} ${
                  feature.highlight ? "font-bold" : ""
                }`}
              >
                {feature.text}
              </span>
            </li>
          ))}
        </ul>
        <p className="font-bold text-center text-2xl mt-6">{price}</p>
        <p className="text-center text-sm text-gray-500">{period}</p>
      </div>
    </div>
  );
}
