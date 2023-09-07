import { TitleAndMetaTags } from "@/components/TitleAndMetaTags";
import axios from "@/lib/axios";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import React, { Fragment } from "react";
import { AddCard, Card, Header } from "../features/dashboard";

type Props = {};

const items = [
  {
    title: "E-commerce Platform",
    id: "e-commerce-platform-5893",
    database: "CockroachDB",
    users: [
      {
        name: "John Doe",
        photoUrl: "/images/IMG_COM_20230306_1042_44_6443.jpg",
      },
      {
        name: "Jane Smith",
        photoUrl: null,
      },
    ],
  },
  {
    title: "Social Media App",
    id: "social-media-app-7421",
    database: "mongodb",
    users: [
      {
        name: "Alice Johnson",
        photoUrl: null,
      },
      {
        name: "Bob Williams",
        photoUrl: "/images/IMG_COM_20230306_1042_44_65116.jpg",
      },
    ],
  },
  {
    title: "Finance Tracker",
    id: "finance-tracker-3167",
    database: "mysql",
    users: [
      {
        name: "Eve Anderson",
        photoUrl: "/images/IMG_COM_20230306_1044_02_6844.jpg",
      },
      {
        name: "Charlie Brown",
        photoUrl: "/images/IMG_COM_20230306_1044_02_69114.jpg",
      },
    ],
  },
  {
    title: "Task Management System",
    id: "task-management-system-8795",
    database: "postgres",
    users: [
      {
        name: "Michael Smith",
        photoUrl: "/images/IMG_COM_20230306_1044_02_6908.jpg",
      },
    ],
  },
  {
    title: "Online Learning Platform",
    id: "online-learning-platform-5241",
    database: "MariaDB",
    users: [
      {
        name: "Oliver Davis",
        photoUrl:
          "https://api.dicebear.com/6.x/adventurer/svg?seed=oliver&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf",
      },
      {
        name: "Sophia Clark",
        photoUrl:
          "https://api.dicebear.com/6.x/adventurer/svg?seed=sophia&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf",
      },
    ],
  },
  {
    title: "Travel Booking Platform",
    id: "travel-booking-platform-9872",
    database: "CockroachDB",
    users: [
      {
        name: "Daniel Wilson",
        photoUrl:
          "https://api.dicebear.com/6.x/adventurer/svg?seed=daniel&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf",
      },
      {
        name: "Emma Thompson",
        photoUrl:
          "https://api.dicebear.com/6.x/adventurer/svg?seed=emma&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf",
      },
      {
        name: "Emily Johnson",
        photoUrl:
          "https://api.dicebear.com/6.x/adventurer/svg?seed=emily&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf",
      },
      {
        name: "Ava Smith",
        photoUrl:
          "https://api.dicebear.com/6.x/adventurer/svg?seed=ava&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf",
      },
    ],
  },
  {
    title: "Inventory Management System",
    id: "inventory-management-system-6514",
    database: "mongodb",
    users: [
      {
        name: "Noah White",
        photoUrl:
          "https://api.dicebear.com/6.x/adventurer/svg?seed=noah&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf",
      },
      {
        name: "Olivia Martinez",
        photoUrl:
          "https://api.dicebear.com/6.x/adventurer/svg?seed=olivia&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf",
      },
    ],
  },
  {
    title: "Restaurant Ordering App",
    id: "restaurant-ordering-app-4312",
    database: "mysql",
    users: [
      {
        name: "William Davis",
        photoUrl:
          "https://api.dicebear.com/6.x/adventurer/svg?seed=william&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf",
      },
      {
        name: "Isabella Brown",
        photoUrl:
          "https://api.dicebear.com/6.x/adventurer/svg?seed=brown&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf",
      },
    ],
  },
  {
    title: "Fitness Tracking Platform",
    id: "fitness-tracking-platform-5698",
    database: "postgres",
    users: [
      {
        name: "James Harris",
        photoUrl:
          "https://api.dicebear.com/6.x/adventurer/svg?seed=james&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf",
      },
      {
        name: "Sophia Hall",
        photoUrl:
          "https://api.dicebear.com/6.x/adventurer/svg?seed=hall&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf",
      },
    ],
  },
  {
    title: "E-learning Marketplace",
    id: "e-learning-marketplace-3279",
    database: "MariaDB",
    users: [
      {
        name: "Logan Turner",
        photoUrl:
          "https://api.dicebear.com/6.x/adventurer/svg?seed=logan&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf",
      },
      {
        name: "Mia Green",
        photoUrl:
          "https://api.dicebear.com/6.x/adventurer/svg?seed=mia&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf",
      },
    ],
  },
  {
    title: "Real Estate Listing App",
    id: "real-estate-listing-app-8956",
    database: "CockroachDB",
    users: [
      {
        name: "Henry Young",
        photoUrl:
          "https://api.dicebear.com/6.x/adventurer/svg?seed=henry&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf",
      },
      {
        name: "Avery Turner",
        photoUrl:
          "https://api.dicebear.com/6.x/adventurer/svg?seed=avery&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf",
      },
    ],
  },
  {
    title: "Online Banking Platform",
    id: "online-banking-platform-2168",
    database: "mongodb",
    users: [
      {
        name: "Alexander Wilson",
        photoUrl:
          "https://api.dicebear.com/6.x/adventurer/svg?seed=alexander&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf",
      },
      {
        name: "Scarlett Foster",
        photoUrl:
          "https://api.dicebear.com/6.x/adventurer/svg?seed=scarlette&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf",
      },
    ],
  },
  {
    title: "Project Management Tool",
    id: "project-management-tool-7803",
    database: "mysql",
    users: [
      {
        name: "Sebastian Baker",
        photoUrl:
          "https://api.dicebear.com/6.x/adventurer/svg?seed=baker&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf",
      },
      {
        name: "Lily Wright",
        photoUrl:
          "https://api.dicebear.com/6.x/adventurer/svg?seed=lily&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf",
      },
    ],
  },
  {
    title: "Music Streaming App",
    id: "music-streaming-app-9837",
    database: "postgres",
    users: [
      {
        name: "Jack Turner",
        photoUrl:
          "https://api.dicebear.com/6.x/adventurer/svg?seed=jack&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf",
      },
      {
        name: "Grace Bennett",
        photoUrl:
          "https://api.dicebear.com/6.x/adventurer/svg?seed=grace&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf",
      },
    ],
  },
];

const limit = 10;

const Dashboard = (props: Props) => {
  const { data: sessionData } = useSession();

  const { data } = useInfiniteQuery({
    queryKey: ["projects"],
    queryFn: async ({ pageParam = 0 }) => {
      const url = `/projects?offset=${pageParam}&limit=${limit}`;

      const { data } = await axios.get<Projects[]>(url);

      return data;
    },
  });

  const user = sessionData?.user;

  const projects = data?.pages.flatMap((page) => page) ?? [];
  return (
    <Fragment>
      <TitleAndMetaTags title="Dashboard | Dashify" />

      <Header />

      <div
        className="bg-black h-[280px]"
        style={{
          backgroundSize: "75px 75px",
          backgroundImage:
            "linear-gradient(to right, #262626 1px, transparent 1px), linear-gradient(to bottom, #262626 1px, transparent 1px)",
        }}
      >
        <div className="px-5 lg:px-10 py-4 pt-10 page-max-width">
          <p className="text-4xl lg:text-5xl font-medium text-white">
            Hello, {user?.lastName} {user?.firstName}
          </p>
          <p className="mt-2 text-base lg:text-lg text-gray-light">
            Select or Create an new Dash
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 px-5 lg:px-10 gap-8 py-10 -mt-[180px] lg:-mt-[150px] page-max-width">
        <AddCard />

        {projects.map((item, index) => (
          <Card key={index} {...item} />
        ))}
      </div>
    </Fragment>
  );
};

export default Dashboard;
