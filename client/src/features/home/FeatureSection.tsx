/* eslint-disable @next/next/no-img-element */
import {
  Chart,
  Data,
  Data2,
  People,
  Refresh,
  Setting3,
  ShieldSecurity,
} from "iconsax-react";
import React from "react";

export const FeatureSection = () => {
  return (
    <section className="px-5 lg:px-10 pb-20 pt-28 page-max-width">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-base font-semibold leading-7 text-indigo-600">
          Everything you need
        </h2>
        <p className="mt-2 text-3xl font-bold tracking-tight text-dark-text dark:text-white sm:text-4xl">
          No Dashboard? No problem.
        </p>
        <p className="mt-6 text-lg leading-8 text-neutral-600 dark:text-neutral-400">
          Effortlessly manage, collaborate, and optimize your database without
          the hassle of a traditional dashboard.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-16">
        {features.map((feature) => (
          <div key={feature.name} className="relative pl-9">
            <dt className="inline font-semibold text-dark-text dark:text-white">
              <feature.icon
                className="absolute left-1 top-1 h-5 w-5 text-indigo-600"
                aria-hidden="true"
              />
              {feature.name}
            </dt>{" "}
            <dd className="inline text-gray-dark dark:text-gray-light">
              {feature.description}
            </dd>
          </div>
        ))}
      </div>
    </section>
  );
};

const features = [
  {
    name: "Centralized Control.",
    description:
      "Manage all your database entries from a single, intuitive dashboard. Say goodbye to scattered data and hello to organized efficiency.",
    icon: Data,
  },
  {
    name: "User Access Management.",
    description:
      "Control who can access and modify your database. Set different permission levels for team members to ensure data security.",
    icon: ShieldSecurity,
  },
  {
    name: "Real-time Updates.",
    description:
      "Instantly update and edit database records, ensuring that your data is always accurate and up-to-date.",
    icon: Refresh,
  },
  {
    name: "Customizable Views.",
    description:
      "Tailor the dashboard layout and views to match your preferences. Create a personalized interface that suits your workflow.",
    icon: Setting3,
  },
  {
    name: "Data Visualization.",
    description:
      "Gain insights with interactive charts and graphs. Visualize trends and patterns to make informed decisions.",
    icon: Chart,
  },
  {
    name: "Team Collaboration.",
    description:
      "Collaborate seamlessly with team members. Work together on the same database while maintaining data integrity.",
    icon: People,
  },
];
