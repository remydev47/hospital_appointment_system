"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";

import { Form } from "@/components/ui/form";
import { createUser } from "@/lib/actions/patient.actions";
import { CreateAppointmentSchema, getAppointmentSchema } from "@/lib/validation";
import { Appointment } from "@/types/appwrite.types";

import "react-phone-number-input/style.css";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { Doctors } from "@/constants";
import { SelectItem } from "../ui/select";
import { createAppointment } from "@/lib/actions/appointment.actions";

export const AppointmentForm = ({
    userId, patientId, type
} : {
    userId: string;
    patientId: string;
    type: "create" | "cancel" | "schedule";
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const AppointmentFormValidation = getAppointmentSchema(type);

  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      primaryPhysician: "",
      schedule: new Date(),
      reason: "",
      note:"",
      cancellationReason: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof AppointmentFormValidation>) => {
    setIsLoading(true);

    let status;
    switch (type) {
      case 'schedule':
        status = 'scheduled';
        break;
      case 'cancel':
        status = 'cancelled';
        break;
      default:
        status = 'pendings';
        break;
    }

    try {
      if (type === 'create' && patientId) {
        const appointmentData = {
          userId,
          patient: patientId,
          primaryPhysician: values.primaryPhysician,
          schedule: new  Date(values.schedule),
          reason: values.reason!,
          note : values.note,
          status: status as Status,
        }
        const appointment = await createAppointment(appointmentData);
        if(appointment) {
          form.reset();
          router.push(`/patients/${userId}/new-appointment/success?appointmentId=${appointment.id}`);
        }
      }

     
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  };
   let buttonLabel;
   switch (type) {
    case 'cancel':
        buttonLabel = 'Cancel Appointment';
        break;
    case 'create':
        buttonLabel = 'Create Appointment';
        break;
    case 'schedule':
        buttonLabel = 'Schedule Appointment';
        break;    
    default:
        break;
   }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-6">
        <section className="mb-12 space-y-4">
          <h1 className="header">New Appointment</h1>
          <p className="text-dark-700">Request a new appointment in 60 seconds.</p>
        </section>

        {type !== "cancel" && (
            <>
              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="primaryPhysician"
                label="Primary Doctor"
                placeholder="Select a Doctor"
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
             <CustomFormField 
                fieldType={FormFieldType.DATE_PICKER}
                control={form.control}
                name="schedule"
                label="Expected appointment date and time"
                showTimeSelect
                dateFormat="MM/DD/YYYY - H:MM:AA"
             />
             <div className="flex flex-col gap-6 xl:flex-row">
                <CustomFormField
                  fieldType={FormFieldType.TEXTAREA}
                  control={form.control}
                  name="reason"
                  label="Reason for Appointment"
                  placeholder="Enter reason for Appointment"
                />
                <CustomFormField
                  fieldType={FormFieldType.TEXTAREA}
                  control={form.control}
                  name="notes"
                  label="Notes"
                  placeholder="Enter Notes"
                />
             </div>
            </>
        )}
        
        {type === "cancel" && (
            <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="cancellationReason"
                label="Reason for Cancellation"
                placeholder="Enter reason for Cancellation"
           />
        )}
        
        <SubmitButton isLoading={isLoading} className={`${type === 'cancel' ? 'shad-danger-btn' : 'shad-primary-btn'} w-full`}>
            {buttonLabel}
        </SubmitButton>
      </form>
    </Form>
  );
};