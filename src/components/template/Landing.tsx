import Link from "next/link"
import Image from "next/image";
import Marquee from "react-fast-marquee";
import { buttonVariants } from "../ui/button"
import { FiArrowRight } from "react-icons/fi";
import audiLogo from "../../../public/audi-logo.svg"
import bmwLogo from "../../../public/bmw-logo.svg"
import ferrariLogo from "../../../public/ferrari-logo.svg"
import lamborghiniLogo from "../../../public/lamborghini-logo.svg"
import mercedesBenzLogo from "../../../public/mercedes-benz-logo.svg"
import nissanNextLogo from "../../../public/nissan-next-logo.svg"
import renaultLogo from "../../../public/renault-logo.svg"
import teslaLogo from "../../../public/tesla-logo.svg"
import volkswagenLogo from "../../../public/volkswagen-logo.svg"
import quote from "../../../public/quote.svg"
import comments from "@/constants/comments.json"

const Landing = () => {
  return (
    <>
      <section id="hero" className="grid grid-cols-1 min-h-[460px] items-center px-5 md:mx-8 mx-5 my-8 bg-muted rounded-md">
        <div className="space-y-3 col-span-1 text-center">
          <h1 className="text-4xl md:text-6xl font-bold" style={{lineHeight: "1.2"}}>Empower Your <br /> Auto Gallery Seamlessly</h1>
          <p className="text-lg">Manage, showcase, rent, and sell cars in one place</p>
          <p className="max-w-3xl mx-auto">or someone seeking to rent or purchase the perfect car, our platform provides seamless solutions for both showcasing and acquiring vehicles. Explore, rent, or buy with ease!</p>
        </div>
      </section>
      <section id="actions" className="px-5 md:px-8 pb-10">
        <div className="flex items-start desktop:flex-nowrap flex-wrap gap-4">
          <Link href={"/rent-car"} className={`${buttonVariants({ variant: "default", size: "lg" })} group h-48 rounded-lg flex-col flex-grow basis-2/6 py-8 !text-lg !items-start !justify-start`}>
            Rental Cars
            <h5 className="text-sm text-muted-foreground">Wanna rent a car? check out rental cars.</h5>
            <FiArrowRight size={24} className="mt-auto text-muted-foreground self-end transition-transform duration-300 group-hover:translate-x-0 group-hover:text-white translate-x-[-0.5rem]"/>
          </Link>
          <Link href={"/buy-car"} className={`${buttonVariants({ variant: "default", size: "lg" })} group h-48 rounded-lg flex-col flex-grow basis-2/6 py-8 !text-lg !items-start !justify-start`}>
            Sale Cars
            <h5 className="text-sm text-muted-foreground">Wanna buy a car? check out sale cars.</h5>
            <FiArrowRight size={24} className="mt-auto text-muted-foreground self-end transition-transform duration-300 group-hover:translate-x-0 group-hover:text-white translate-x-[-0.5rem]"/>
          </Link>
          <Link href={"/galleries"} className={`${buttonVariants({ variant: "default", size: "lg" })} group h-48 rounded-lg flex-col flex-grow basis-2/6 py-8 !text-lg !items-start !justify-start`}>
            Galleries
            <h5 className="text-sm text-muted-foreground">Looking for an special auto gallery? check out and find it.</h5>
            <FiArrowRight size={24} className="mt-auto text-muted-foreground self-end transition-transform duration-300 group-hover:translate-x-0 group-hover:text-white translate-x-[-0.5rem]"/>
          </Link>
        </div>
      </section>
      <section id="brands" className="py-12 space-y-14">
        <h3 className="text-2xl font-semibold text-muted-foreground text-center">Supported Brands</h3>
        <Marquee speed={30} gradient={true} gradientColor={"#FAFAFA"} gradientWidth={140} >
          <Image className="mx-20" src={bmwLogo} alt="bmw-logo"/>
          <Image className="mx-20" src={ferrariLogo} alt="ferrari-logo"/>
          <Image className="mx-20" src={nissanNextLogo} alt="nissan-next-logo"/>
          <Image className="mx-20" src={teslaLogo} alt="tesla-logo"/>
          <Image className="mx-20" src={mercedesBenzLogo} alt="mercedes-benz-logo"/>
          <Image className="mx-20" src={lamborghiniLogo} alt="lamborghini-logo"/>
          <Image className="mx-20" src={renaultLogo} alt="renault-logo"/>
          <Image className="mx-20" src={audiLogo} alt="audio-logo"/>
          <Image className="mx-20" src={volkswagenLogo} alt="volkswagen-logo"/>
        </Marquee>
        <div className="bg-secondary w-fit mx-auto rounded-full p-6 px-8">
          <h4 className="text-lg font-medium">And <span className="text-white bg-primary p-1.5 rounded-full">+50</span></h4>
        </div>
      </section>
      <section id="comments" className="py-12 px-5 md:px-8">
        <Image className="mx-auto mb-8" src={quote} alt="quote"/>
        <p className="mx-auto max-w-4xl text-lg text-muted-foreground text-center mb-24">Our mission is to empower auto gallery agents with seamless inventory management and sales tools while offering prospective buyers and renters a hassle-free experience to explore, rent, or purchase their ideal car. Simplifying transactions and expanding choices, we bridge the gap between agents and seekers, revolutionizing the automotive industry.</p>
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 gap-y-12 mb-10">
          {comments.map((comment) => (
            <div key={comment.id} className="relative col-span-1">
              <div className="absolute select-none -top-10 -left-4">
                <span className="text-[160px] leading-none text-muted-foreground/30">“</span>
              </div>
              <div className="!backdrop-blur-sm bg-white/95 shadow-sm rounded-xl supports-[backdrop-filter]:bg-white/10 p-4">
                <blockquote className="space-y-2">
                  <p className="text-xl">
                    &ldquo;{comment.comment}.&rdquo;
                  </p>
                  <footer className="flex items-center pt-4 text-sm text-muted-foreground"><Image src={comment.image} width={48} height={48} quality={100} alt="user" className="rounded-full me-3"/><h5 className="font-semibold">{comment.author}</h5></footer>
                </blockquote>
              </div>
            </div>
          ))}
        </div>
      </section>
      <footer className="py-6 px-5 md:px-8 border-t">
        <p className="text-muted-foreground">© {new Date().getFullYear()} autzon. All rights reserved.</p>
      </footer>
    </>
  )
}

export default Landing