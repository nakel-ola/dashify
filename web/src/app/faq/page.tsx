import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import React, { Fragment } from "react";
import { BlackGradientCard } from "../about-us/features";
import { Footer, Navbar } from "../features";

export default function FAQ() {
  return (
    <Fragment>
      <Navbar scrollY={[100, 280, 280]} />

      <BlackGradientCard>
        <h2 className="text-base font-semibold leading-7 text-indigo-600">
          The FAQs
        </h2>
        <p className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Help Center
        </p>

        <p className="text-gray-light mt-4 px-5">
          freedom bread will frog vessels value short attack pictured managed
          shinning chose dog we zero additional necessary stepped rice business
          rest motion older pleasure
        </p>
      </BlackGradientCard>

      <div className="page-max-width flex flex-col items-center pb-20">
        <div className="w-[90%] lg:w-[80%]">
          <Accordion
            type="single"
            collapsible
            className="w-full pt-10 divide-y divide-slate-100 dark:divide-neutral-700"
          >
            {items.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-0"
              >
                <AccordionTrigger className="text-xl text-start text-black dark:text-white">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-base text-gray-dark dark:text-gray-light">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>

      <Footer />
    </Fragment>
  );
}

const items = [
  {
    question: "What is the purpose of the admin dashboard?",
    answer:
      "The admin dashboard serves as a centralized platform to manage and control your database efficiently. It provides easy access to your data and simplifies tasks like updating, editing, and monitoring your database entries.",
  },
  {
    question: "How do I access the admin dashboard?",
    answer:
      "Once you sign up for our service, you will receive login credentials. You can use these credentials to access the admin dashboard securely through our website.",
  },
  {
    question:
      "Can multiple users collaborate on the same database through the dashboard?",
    answer:
      "Yes, our admin dashboard supports team collaboration. You can invite team members and assign them different access levels, allowing them to work together on the same database while maintaining data security and integrity.",
  },
  {
    question: "Is my data safe and secure on the admin dashboard?",
    answer:
      "Absolutely! We take data security seriously. Our platform employs industry-standard encryption protocols to safeguard your data. Additionally, we regularly backup your data to ensure its safety and reliability.",
  },
  {
    question: "Does the dashboard offer data analytics and insights?",
    answer:
      "Yes, our admin dashboard includes data analytics features that provide valuable insights into your database performance. You can visualize data trends, create reports, and make data-driven decisions to optimize your operations.",
  },
  {
    question: "Can I customize the dashboard to match my branding?",
    answer:
      "Certainly! Our admin dashboard is designed with flexibility in mind. You can customize the dashboard's appearance, including colors, logos, and layouts, to reflect your brand's identity.",
  },
  {
    question: "How often are updates and new features released?",
    answer:
      "We strive to improve our services continuously. Updates and new features are regularly rolled out to enhance the user experience and ensure you have access to the latest tools for managing your database effectively.",
  },
  {
    question: "Is there a trial period for the admin dashboard?",
    answer:
      "Yes, we offer a free trial period for you to explore the full capabilities of our admin dashboard. Sign up today to experience the benefits firsthand!",
  },
];
