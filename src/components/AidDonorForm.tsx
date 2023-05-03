import React, { useState } from "react";
import z from "zod";
import { DonorType, DonorSchema, PerferedCommunication } from "prisma/zod";
import { Field, Form, Select } from "./Form";

type DonerT = z.infer<typeof DonorSchema>;
export default function DonerForm() {
  const [donorType, setDonorType] = useState<DonerT["donorType"]>(
    DonorType.enum.ORGANIZATION,
  );
  return (
    <Form
      schema={DonorSchema}
      title="Doner Form"
      submitFn={(data) => {
        console.log(data);
      }}
    >
      <div className="grid">
        <Field name="name" />
        <Select
          name="donorType"
          options={DonorType.options}
          onChange={(e) => {
            setDonorType(e.currentTarget.value as DonerT["donorType"]);
          }}
        />
        <Select
          name="preferredCommunication"
          options={PerferedCommunication.options}
        />
      </div>

      {donorType === DonorType.enum.ORGANIZATION ? (
        <div className="grid">
          <Field name="organizationName" />
          <Field name="organizationHeadquarter" />
        </div>
      ) : (
        <Field name="age" type="number" />
      )}
      <div className="grid">
        <Field name="email" type="email" />
        <Field name="phoneNumber" type="tel" />
      </div>
      <Field name="mailingAddress" />
    </Form>
  );
}
