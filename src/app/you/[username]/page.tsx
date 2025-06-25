'use client'
import { messageSchema } from '@/schemas/messageSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod/v4';
import axios, { AxiosError } from 'axios';
import { useParams } from 'next/navigation';
import { useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { ApiResponse } from '@/types/ApiResponse';
import { useCompletion } from '@ai-sdk/react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from 'lucide-react';
import { Separator } from "@/components/ui/separator";

const parseStringMessages = (messages: string): string[] => {
  // console.log("Parsing Data : ",messages)
  return messages.split('||');
}

const initialMessageString =
  "What's your favorite movie?||Do you have any pets?||What's your dream job?";

const Page = () => {
  const {username} = useParams<{username: string}>();

  const [isLoading,setIsLoading] = useState(false);

  const {
    completion,
    complete,
    isLoading: isSuggestLoading,
    error,
  } = useCompletion({
    api: "/api/suggest-messages",
    initialCompletion: initialMessageString,
  });

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = form.watch('content');

  const handleClickMessage = (message: string) => {
    form.setValue('content',message)
  }

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    console.log("Message content :",messageContent)
    console.log("Sending message:", data);
    try{
      const response = await axios.post('/api/send-message',{
        username: username,
        content: data.content
      });

        toast.success(
          <div>
            <p className="font-semibold text-green-600">Message sent successfully!</p>
            <p className="text-sm text-gray-800">Your message has been delivered.</p>
          </div>
        );

        form.reset({...form.getValues(), content: ''});

    }catch(error){
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(
        <div>
          <p className="font-semibold text-red-600">{axiosError.response?.data.message || "Message sending failure"}</p>
          <p className="text-sm text-gray-800">Please try again later.</p>
        </div>
      );
      
    }finally{
      setIsLoading(false);
    }
  }

  const handleSuggestMessage = async() => {
    try{
      await complete('')
      // console.log("Completion after suggest:", completion);

    }catch(error){
      console.error("Error fetching messages:", error);
    }
  }

  return (
    <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Public Profile Link
      </h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send Anonymous Message to @{username}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your anonymous message here"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            {isLoading ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              </Button>
            ) : (
              <Button type="submit" className='cursor-pointer' disabled={isLoading}>
                Send It
              </Button>
            )}
          </div>
        </form>
      </Form>

      <div className="space-y-4 my-8">
        <div className="space-y-2">
          <Button
            onClick={handleSuggestMessage}
            className="my-4 cursor-pointer"
            disabled={isSuggestLoading}
          >
            Suggest Messages
          </Button>
          <p>Click on any message below to select it.</p>
        </div>
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">Messages</h3>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            {error ? (
              <p className="text-red-500">{error.message}</p>
            ) : (
              parseStringMessages(completion).map((message, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="mb-2 w-full text-left text-wrap"
                  onClick={() => handleClickMessage(message)}
                >
                  {message}
                </Button>
              ))
            )}
          </CardContent>
        </Card>
      </div>
      <Separator className="my-6" />
      <div className="text-center">
        <div className="mb-4">Get Your Message Board</div>
        <Link href={"/sign-up"}>
          <Button className='cursor-pointer'>Create Your Account</Button>
        </Link>
      </div>
    </div>
  );
}

export default Page
