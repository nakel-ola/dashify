import Image from "next/image";
import React, { Fragment } from "react";
import { Footer, Navbar } from "../features";
import { BlackGradientCard } from "./features";

export default function AboutUs() {
  return (
    <Fragment>
      <Navbar scrollY={[100, 280, 280]} />

      <BlackGradientCard>
        <h2 className="text-base font-semibold leading-7 text-indigo-600">
          About Us
        </h2>
        <p className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">
          We love creators
        </p>

        <p className="text-gray-light mt-4 px-5">
          later average person flower both society every thy twelve sing rough
          aboard handsome it stronger affect win today lungs office grabbed
          sweet star gate
        </p>
      </BlackGradientCard>

      <div className="page-max-width flex flex-col items-center pb-20 ">
        <div className="w-full mt-10 px-5 lg:px-10">
          <h1 className="text-5xl text-black dark:text-white">Our mission</h1>

          <div className="flex flex-col lg:flex-row">
            <div className="max-w-3xl">
              <p className="text-xl py-5 text-black dark:text-white">
                Aliquet nec orci mattis amet quisque ullamcorper neque, nibh
                sem. At arcu, sit dui mi, nibh dui, diam eget aliquam. Quisque
                id at vitae feugiat egestas ac. Diam nulla orci at in viverra
                scelerisque eget. Eleifend egestas fringilla sapien.
              </p>

              <p className="py-5 text-neutral-600 dark:text-neutral-400">
                Faucibus commodo massa rhoncus, volutpat. Dignissim sed eget
                risus enim. Mattis mauris semper sed amet vitae sed turpis id.
                Id dolor praesent donec est. Odio penatibus risus viverra tellus
                varius sit neque erat velit. Faucibus commodo massa rhoncus,
                volutpat. Dignissim sed eget risus enim. Mattis mauris semper
                sed amet vitae sed turpis id.
              </p>

              <p className="py-5 text-neutral-600 dark:text-neutral-400">
                Et vitae blandit facilisi magna lacus commodo. Vitae sapien duis
                odio id et. Id blandit molestie auctor fermentum dignissim.
                Lacus diam tincidunt ac cursus in vel. Mauris varius vulputate
                et ultrices hac adipiscing egestas. Iaculis convallis ac tempor
                et ut. Ac lorem vel integer orci.
              </p>
            </div>
          </div>
        </div>

        <div className="h-[200px] lg:h-[430px] w-full my-24">
          <Image
            src="/photo-1529156069898-49953e39b3ac.jpeg"
            width={1000}
            height={200}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>

        <div className="w-full mt-10 px-5 lg:px-10">
          <h1 className="text-5xl text-black dark:text-white">Our vision</h1>

          <p className="text-xl py-5 max-w-3xl text-black dark:text-white">
            Lorem ipsum dolor sit amet consect adipisicing elit. Possimus magnam
            voluptatum cupiditate veritatis in accusamus quisquam.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 pt-10">
            {items.map((item, index) => (
              <div key={index} className="">
                <p className="text-2xl font-medium text-black dark:text-white">
                  {item.title}
                </p>
                <p className="text-neutral-600 dark:text-neutral-400 pt-2">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </Fragment>
  );
}

const items = [
  {
    title: "Be world-class",
    description:
      "Aut illo quae. Ut et harum ea animi natus. Culpa maiores et sed sint et magnam exercitationem quia. Ullam voluptas nihil vitae dicta molestiae et. Aliquid velit porro vero.",
  },
  {
    title: "Share everything you know",
    description:
      "Mollitia delectus a omnis. Quae velit aliquid. Qui nulla maxime adipisci illo id molestiae. Cumque cum ut minus rerum architecto magnam consequatur. Quia quaerat minima.",
  },
  {
    title: "Always learning",
    description:
      "Aut repellendus et officiis dolor possimus. Deserunt velit quasi sunt fuga error labore quia ipsum. Commodi autem voluptatem nam. Quos voluptatem totam.",
  },
  {
    title: "Be supportive",
    description:
      "Magnam provident veritatis odit. Vitae eligendi repellat non. Eum fugit impedit veritatis ducimus. Non qui aspernatur laudantium modi. Praesentium rerum error deserunt harum.",
  },
  {
    title: "Take responsibility",
    description:
      "Sit minus expedita quam in ullam molestiae dignissimos in harum. Tenetur dolorem iure. Non nesciunt dolorem veniam necessitatibus laboriosam voluptas perspiciatis error.",
  },
  {
    title: "Enjoy downtime",
    description:
      "Ipsa in earum deserunt aut. Quos minus aut animi et soluta. Ipsum dicta ut quia eius. Possimus reprehenderit iste aspernatur ut est velit consequatur distinctio.",
  },
];
