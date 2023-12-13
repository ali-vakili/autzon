import Link from "next/link"
import { buttonVariants } from "../ui/button"
import { FiArrowRight } from "react-icons/fi";

const Landing = () => {
  return (
    <>
      <section id="hero" className="grid grid-cols-2 md:grid-cols-12 min-h-[480px] items-center container px-4">
        <div className="space-y-3 md:col-start-2 md:col-span-5 col-span-1">
          <h1 className="text-4xl md:text-5xl font-bold" style={{lineHeight: "1.2"}}>Empower Your <br /> Auto Gallery Seamlessly</h1>
          <p className="text-lg">Manage, showcase, rent, and sell cars in one place</p>
          <p>or someone seeking to rent or purchase the perfect car, our platform provides seamless solutions for both showcasing and acquiring vehicles. Explore, rent, or buy with ease!</p>
        </div>
      </section>
      <section id="actions" className="container pb-10">
        <div className="flex items-start desktop:flex-nowrap flex-wrap gap-4">
          <Link href={"#"} className={`${buttonVariants({ variant: "default", size: "lg" })} group h-48 rounded-lg flex-col flex-grow basis-2/6 py-8 !text-lg !items-start !justify-start`}>
            Rental Cars
            <h5 className="text-sm text-muted-foreground">Wanna rent a car? check out rental cars.</h5>
            <FiArrowRight size={24} className="mt-auto text-muted-foreground self-end transition-transform duration-300 group-hover:translate-x-0 group-hover:text-white translate-x-[-0.5rem]"/>
          </Link>
          <Link href={"#"} className={`${buttonVariants({ variant: "default", size: "lg" })} group h-48 rounded-lg flex-col flex-grow basis-2/6 py-8 !text-lg !items-start !justify-start`}>
            Sale Cars
            <h5 className="text-sm text-muted-foreground">Wanna buy a car? check out sale cars.</h5>
            <FiArrowRight size={24} className="mt-auto text-muted-foreground self-end transition-transform duration-300 group-hover:translate-x-0 group-hover:text-white translate-x-[-0.5rem]"/>
          </Link>
          <Link href={"#"} className={`${buttonVariants({ variant: "default", size: "lg" })} group h-48 rounded-lg flex-col flex-grow basis-2/6 py-8 !text-lg !items-start !justify-start`}>
            Galleries
            <h5 className="text-sm text-muted-foreground">Looking for an special auto gallery? check out and find it.</h5>
            <FiArrowRight size={24} className="mt-auto text-muted-foreground self-end transition-transform duration-300 group-hover:translate-x-0 group-hover:text-white translate-x-[-0.5rem]"/>
          </Link>
        </div>
      </section>
    </>
  )
}

export default Landing