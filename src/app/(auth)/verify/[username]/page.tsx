'use client'
import { verifySchema } from '@/schemas/verifySchema';
import { useParams, useRouter } from 'next/navigation'
import { z } from 'zod/v4';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import { Form,FormField,FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from '@/components/ui/input-otp';
import { Loader2 } from 'lucide-react';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { ApiResponse } from '@/types/ApiResponse';

const VerifyAccount = () => {
    const router = useRouter();
    const params = useParams<{username: string}>();

    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            code: ''
        }
    })

    const onSubmit = async(data: z.infer<typeof verifySchema>) => {
        setIsSubmitting(true);
        console.log("Entered OTP : ",data.code);
        try{
            const response = await axios.post('/api/verify-code',{ username: params.username, code: data.code })

            if(!response.data.success){
                toast.error(response.data.message || 'Failed to verify account. Please try again.');
            }
            toast.success(response.data.message || 'Account verified successfully!');
            router.replace(`/sign-in`);

        }catch(error){
            console.error("Error verifying account:", error);
            const axiosError = error as AxiosError<ApiResponse>;
            const errorMessage = axiosError.response?.data.message || "Failed to verify account. Please try again.";
            toast.error(errorMessage);
        }finally {
            form.reset();
            setIsSubmitting(false);
        }
    }

  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Verify Your Account
          </h1>
          <p className="mb-4">Enter the verification code sent to your email</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="code"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <InputOTP
                    maxLength={6}
                    onChange={(val) => field.onChange(val)}
                    value={field.value}
                    pattern={REGEXP_ONLY_DIGITS}
                    className="flex justify-center gap-3"
                  >
                    <InputOTPGroup className="flex gap-3">
                      <InputOTPSlot
                        index={0}
                        className="w-12 h-12 text-2xl text-center border-2 border-gray-500 rounded-lg focus:outline-none focus:border-blue-600 transition-colors"
                      />
                      <InputOTPSlot
                        index={1}
                        className="w-12 h-12 text-2xl text-center border-2 border-gray-500 rounded-lg focus:outline-none focus:border-blue-600 transition-colors"
                      />
                      <InputOTPSlot
                        index={2}
                        className="w-12 h-12 text-2xl text-center border-2 border-gray-500 rounded-lg focus:outline-none focus:border-blue-600 transition-colors"
                      />
                    </InputOTPGroup>

                    <InputOTPSeparator className="w-4" />

                    <InputOTPGroup className="flex gap-3">
                      <InputOTPSlot
                        index={3}
                        className="w-12 h-12 text-2xl text-center border-2 border-gray-500 rounded-lg focus:outline-none focus:border-blue-600 transition-colors"
                      />
                      <InputOTPSlot
                        index={4}
                        className="w-12 h-12 text-2xl text-center border-2 border-gray-500 rounded-lg focus:outline-none focus:border-blue-600 transition-colors"
                      />
                      <InputOTPSlot
                        index={5}
                        className="w-12 h-12 text-2xl text-center border-2 border-gray-500 rounded-lg focus:outline-none focus:border-blue-600 transition-colors"
                      />
                    </InputOTPGroup>
                  </InputOTP>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full cursor-pointer" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                </>
              ) : (
                "Verify Account"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default VerifyAccount
