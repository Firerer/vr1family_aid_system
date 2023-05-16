import React, { useState } from "react";
import z from "zod";
import { DonorType, PrivateDonorSchema } from "prisma/zod";
import { Field, Form, Select } from "./Form";

type DonerT = z.infer<typeof PrivateDonorSchema>;
export default function DonerForm() {
  const [donorType, setDonorType] = useState<DonerT["donorType"]>(
    DonorType.enum.ORGANIZATION,
  );
  return (
    <Form
      schema={PrivateDonorSchema}
      title="Donor Form - Private Information"
      submitFn={(data) => {
        console.log(data);
      }}
    >
      <div className="grid">
        <Field name="name" />
      </div>
      <div className="grid">
        <Field name="ID 1 DocumentNumber" />
        <Field name="ID 1 ExpiryDate" type="date" />
      </div>
      <div className="grid">
        <Field name="ID 2 DocumentNumber" optional />
        <Field name="ID 2 expiryDate" type="date" optional />
      </div>
      <div className="grid">
        <Field name="ID 3 DocumentNumber" optional />
        <Field name="ID 3 ExpiryDate" type="date" optional />
      </div>
      <div className="grid">
        <Select
          name="donorType"
          options={DonorType.options}
          onChange={(e) => {
            setDonorType(e.currentTarget.value as DonerT["donorType"]);
          }}
        />
       {donorType === DonorType.enum.ORGANIZATION ? (
        <div className="grid">
          <Field name="abn" type="numbers" />
        </div>
      ) : (
        <Field name="AnyOtherImportantInformation" optional/>
      )}
      </div>
    </Form>
  );
}
