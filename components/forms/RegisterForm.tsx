"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { z } from "zod";

import { Form, FormControl } from "@/components/ui/form";
import { createUser } from "@/lib/actions/patient.actions";
import { UserFormValidation } from "@/lib/validation";

import "react-phone-number-input/style.css";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Doctors, GenderOptions, IdentificationTypes } from "@/constants";
import { Label } from "../ui/label";
import { SelectItem } from "../ui/select";
import FileUploader from "../FileUploader";

export const RegisterForm = ({user} : {user: User}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof UserFormValidation>) => {
    setIsLoading(true);

    try {
      const user = {
        name: values.name,
        email: values.email,
        phone: values.phone,
      };

      const newUser = await createUser(user);

      if (newUser) {
        router.push(`/patients/${newUser.$id}/register`);
      }
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-12">
        <section className=" space-y-4">
          <h1 className="header">Welcome</h1>
          <p className="text-dark-700">Let Us Know more About YourSelf</p>
        </section>
        <section className="space-y-6">
            <div className="mb-9 space-y-6">
            <h2 className="sub-header">Personal Information</h2>
            </div>
        </section>

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="name"
          label= "Full Name"
          placeholder="John Doe"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
        />

        <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="email"
                label="Email"
                placeholder="johndoe@gmail.com"
                iconSrc="/assets/icons/email.svg"
                iconAlt="email"
            />

            <CustomFormField
                fieldType={FormFieldType.PHONE_INPUT}
                control={form.control}
                name="phone"
                label="Phone number"
                placeholder="(555) 123-4567"
            />
        </div>
        <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
                fieldType={FormFieldType.DATE_PICKER}
                control={form.control}
                name="birthdate"
                label="Date of Birth"           
            />

            <CustomFormField
                fieldType={FormFieldType.SKELETON}
                control={form.control}
                name="gender"
                label="Gender"
                renderSkeleton={
                    (field) => (
                        <FormControl>
                           <RadioGroup
                             className="flex h-11 gap-6 xl:justify-between" 
                             onValueChange={field.onChange}
                             defaultValue={field.value}
                           >
                            {GenderOptions.map((option) => (
                                <div key={option} className="radio-group">
                                    <RadioGroupItem
                                       value={option}
                                       id={option}
                                    />
                                    <Label htmlFor={option} className="cursor-pointer">
                                        {option}
                                    </Label>
                                </div>
                            ))}
                           </RadioGroup>
                        </FormControl>
                    )
                }
            />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="address"
                label="Address"
                placeholder="Biashara Street, Kiambu"
            />
            <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="occupation"
                label="Occupation"
                placeholder="Civil Engineer"      
            />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="emergencyContactName"
                label="Emergency Contact Name"
                placeholder="Guardian's Name"
            />

            <CustomFormField
                fieldType={FormFieldType.PHONE_INPUT}
                control={form.control}
                name="emergencyContactNumber"
                label="Emergency Contact Number"
                placeholder="(555) 123-4567"
            />
        </div>
        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">
              Medical Information
            </h2>
          </div>
        </section>

        <CustomFormField
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name="primaryPhysician"
          label="Primary Physician"
          placeholder="Select a Physician"
        >
          {Doctors.map((doctor) => (
            <SelectItem  key={doctor.name} value={doctor.name}>
              
              <div className="flex cursor-pointer items-center gap-2">
                <Image 
                  src={doctor.image}
                  alt={doctor.name}
                  height={32}
                  width={32}
                  className="rounded-full border border-dark-500"
                />
                <p>{doctor.name}</p>
              </div>
            </SelectItem>
          ))}
        </CustomFormField>

        <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="insuranceProvider"
                  label="Insuarance Provider"
                  placeholder="AAR Healthcare"
              />
              <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="insurancePolicyNumber"
                  label="Insuarance Policy Number"
                  placeholder="BC12345678"      
              />
        </div>
        
        <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
                  fieldType={FormFieldType.TEXTAREA}
                  control={form.control}
                  name="allergies"
                  label="Allergies (If Any)"
                  placeholder="Pollen, Penicillin and Peanut"
              />
              <CustomFormField
                  fieldType={FormFieldType.TEXTAREA}
                  control={form.control}
                  name="currentMedication"
                  label="Current Medication (If Any)"
                  placeholder="Ibuprofin 200mg, Palacetamol 500mg"      
              />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
                  fieldType={FormFieldType.TEXTAREA}
                  control={form.control}
                  name="currentMediaction"
                  label="Family Medical History"
                  placeholder="Mother was Haemophilic, Father had Hydrosis"
              />
              <CustomFormField
                  fieldType={FormFieldType.TEXTAREA}
                  control={form.control}
                  name="pastMedicalHistory"
                  label="Past Medical History"
                  placeholder="Appendectomy, Tonsillectomy"      
              />
        </div>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">
              Identification and Verification
            </h2>
          </div>
        </section>
        <CustomFormField
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name="identificationType"
          label="Identification Type"
          placeholder="Select an identifier type"
        >
          {IdentificationTypes.map((type) => (
            <SelectItem  key={type} value={type}>
               {type}
            </SelectItem>
          ))}
        </CustomFormField>
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="identicationNumber"
          label="Identification Number"
          placeholder="1234567"
        />

           <CustomFormField
              fieldType={FormFieldType.SKELETON}
              control={form.control}
              name="IdentifictionDocument"
              label="Scanned Copy of Identification Document"
              renderSkeleton={(field) => (
                <FormControl>
                  <FileUploader files={field.value} onChange={field.onChange}/>
                </FormControl>
              )}
                
            />

        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>
  );
};
export default RegisterForm;