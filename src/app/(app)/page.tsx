'use client'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent,CardHeader,CardTitle } from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay";
import messages from '@/messages.json';
import { Mail } from "lucide-react";


export default function Home() {
  return (
    <>
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-gray-800 text-white">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold">
            Dive into the World of Anonymous Feedback
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg">
            True Feedback - Where your identity remains a secret.
          </p>
        </section>
        <Carousel
          plugins={[
            Autoplay({
              delay: 2000,
            }),
          ]}
          className="w-full max-w-xs"
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index} className="p-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{message.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
                    <Mail className="flex-shrink-0" />
                    <div>
                      <p>{message.content}</p>
                      <p className="text-black text-xs">
                        - {message.received}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </main>

      <footer className="text-center p-4 md:p-6 bg-gray-900 text-white">
        <p className="text-sm md:text-base">
          &copy; {new Date().getFullYear()} True Feedback. All rights reserved.
        </p>
        <div className="mt-2">
          <a
            href="#"
            className="text-sm md:text-base text-gray-400 hover:text-white"
          >
            Visit True Feedback
          </a>
        </div>
      </footer>
    </>
  );
}
