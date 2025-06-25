'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from 'zod/v4'
import Link from "next/link"
import {useDebounceCallback } from "usehooks-ts"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios, { AxiosError} from 'axios';
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormDescription, FormField, FormLabel, FormMessage,FormItem,FormControl } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from 'lucide-react';

const SignUpPage = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage,setUsernameMessage] = useState('');
  const [isCheckingUsername,setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // using debouncing library as we check for username availability multiple calling at a time
  const debouncedUsername = useDebounceCallback(setUsername, 300);
  const router = useRouter();

  // zod implementation
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: ""
    }
  })

  const onSubmit = async(data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try{
      console.log("Form data before submission:", data);

      const response = await axios.post('/api/sign-up',data);
      console.log("Sign up response:", response.data);

      toast.success(
        <div>
          <p className="font-semibold text-green-600">🎉 Account created!</p>
          <p className="text-sm text-gray-800">
            You’re ready to verify your email.
          </p>
        </div>,
        {
          duration: 5000,
        }
      );

      router.replace(`/verify/${username}`)
      setIsSubmitting(false);

    }catch(error){
      console.error("Error signing up:", error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message || "Failed to sign up.";
      toast.error(
        <div>
          <p className="font-semibold text-red-600">⚠️ Sign up failed</p>
          <p className="text-sm text-gray-800">Please try again later.</p>
        </div>,
        {
          duration: 5000,
        }
      );
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    const isUsernameUnique = async () => {
      if(username){
        setIsCheckingUsername(true);
        setUsernameMessage('');

        try{
          const response = await axios.get(`/api/username-uniqueness?username=${username}`);
          // console.log("Username uniqueness response:", response);

          let message = response.data.message
          setUsernameMessage(message);

        }catch(error){
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(axiosError.response?.data.message || "Failed to check username uniqueness.");
        }finally{
          setIsCheckingUsername(false);
        }
      }
    }

    isUsernameUnique();

  },[username]);


  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Mystery Feedback
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Username"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        debouncedUsername(e.target.value);
                      }}
                    />
                  </FormControl>
                  {isCheckingUsername && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {usernameMessage && (
                    <p
                      className={`text-sm mt-1 ${
                        usernameMessage.toLowerCase().includes("available")
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {usernameMessage}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a valid email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter a strong password"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Password must be at least 8 characters long
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isSubmitting || isCheckingUsername}
              className="w-full cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                </>
              ) : (
                "Signup"
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Already a member?{" "}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage
