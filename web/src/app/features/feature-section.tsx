import {
  AddSquare,
  Chart,
  Convertshape,
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
        {items.map(({ name, Icon, description }) => (
          <div key={name} className="relative pl-9">
            <dt className="inline font-semibold text-dark-text dark:text-white">
              <Icon
                className="absolute left-1 top-1 h-5 w-5 text-indigo-600"
                aria-hidden="true"
              />
              {name}
            </dt>{" "}
            <dd className="inline text-gray-dark dark:text-gray-light">
              {description}
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
    Icon: Data,
  },
  {
    name: "User Access Management.",
    description:
      "Control who can access and modify your database. Set different permission levels for team members to ensure data security.",
    Icon: ShieldSecurity,
  },
  {
    name: "Real-time Updates.",
    description:
      "Instantly update and edit database records, ensuring that your data is always accurate and up-to-date.",
    Icon: Refresh,
  },
  {
    name: "Customizable Views.",
    description:
      "Tailor the dashboard layout and views to match your preferences. Create a personalized interface that suits your workflow.",
    Icon: Setting3,
  },
  {
    name: "Data Visualization.",
    description:
      "Gain insights with interactive charts and graphs. Visualize trends and patterns to make informed decisions.",
    Icon: Chart,
  },
  {
    name: "Team Collaboration.",
    description:
      "Collaborate seamlessly with team members. Work together on the same database while maintaining data integrity.",
    Icon: People,
  },
];

const items = [
  {
    name: "Seamless Database Connectivity",
    description:
      "Connect to existing MongoDB, Postgres, or MySQL databases effortlessly, without the need to create new databases.",
    Icon: Convertshape,
  },
  {
    name: "Intuitive Table Modification",
    description:
      "Our intuitive user interface allows your team to modify existing tables with ease. Add, remove, or edit columns effortlessly to meet your project requirements.",
    Icon: Data2,
  },
  {
    name: "Efficient Table Creation",
    description:
      "Create new tables within your existing databases quickly and intuitively. Define column names, data types, and constraints effortlessly through our streamlined interface.",
    Icon: AddSquare,
  },
  {
    name: "Visual Data Modeling",
    description:
      "Visualize your database schema with ease, helping your team understand the structure of the database and facilitating better decision-making during development.",
    Icon: Data,
  },
  {
    name: "Role-Based Access Control",
    description:
      "Maintain control over database management tasks with role-based access control. Define user roles and permissions to ensure data security and integrity.",
    Icon: ShieldSecurity,
  },
];
