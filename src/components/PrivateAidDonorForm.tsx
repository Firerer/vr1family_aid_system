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
        <Field name="idDocumentNumber1" />
        <Field name="idExpiryDate1" type="date" />
      </div>
      <div className="grid">
        <Field name="idDocumentNumber2" optional />
        <Field name="idExpiryDate2" type="date" optional />
      </div>
      <div className="grid">
        <Field name="idDocumentNumber3" optional />
        <Field name="idExpiryDate3" type="date" optional />
      </div>
      <div className="grid">
        <Select
          name="donorType"
          options={DonorType.options}
          onChange={(e) => {
            setDonorType(e.currentTarget.value as DonerT["donorType"]);
          }}
        />
      </div>

      {donorType === DonorType.enum.ORGANIZATION ? (
        <div className="grid">
          <Field name="abn" type="abn" />
        </div>
      ) : (
        <Field name="age" type="number" />
      )}
    </Form>
  );
}
