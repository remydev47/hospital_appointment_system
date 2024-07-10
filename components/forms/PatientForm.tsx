"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormField } from "@/components/ui/form"
import { Button } from "../ui/button"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { UserFormValidation } from "@/lib/validation"
import { createUntrackedSearchParams } from "next/dist/client/components/search-params"
import { useRouter } from "next/navigation"

export enum FormFieldType {
    INPUT= 'input',
    TEXTAREA="textarea",
    PHONE_INPUT="phoneInput",
    CHECKBOX="checkbox",
    DATE_PICKER = 'datePicker',
    SELECT="select",
    SKELETON="skeleton"
}

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
})
 
const PatientForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  // 1. Define your form.
  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone:"",
    },
  })
 
 
  async function onSubmit({name, email, phone}: z.infer<typeof UserFormValidation>) {
    setIsLoading(true);
    try {
        // const userData ={name,email,phone};
        // const user = await createUser(userData);

        // if(user) router.push(`/patients/${user.$id}/register`)
        }catch(error) {
            console.log(error);
        
    }
   
}

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="mb-12 space-y-4">
            <h1 className="header">Hi there 👋</h1>
            <p className="text-dark-700">Schedule Your First Appointment</p>
        </section>
        <CustomFormField 
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="name"
          label="Full Name"
          placeholder="Joe Smith"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
        />
        <CustomFormField 
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="email"
          label="Email"
          placeholder="joesmith@outlook.com"
          iconSrc="/assets/icons/email.svg"
          iconAlt="email"
        />
        <CustomFormField 
          fieldType={FormFieldType.PHONE_INPUT}
          control={form.control}
          name="phone"
          label="Phone Number"
          placeholder="(555) 123-4567"
          
        />
       <SubmitButton isLoading={isLoading}>
         Get Started
       </SubmitButton>
      </form>
    </Form>
  )
}

export default PatientForm; 