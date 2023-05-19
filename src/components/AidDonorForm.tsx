import React, { useState } from "react";
import z from "zod";
import { DonorType, DonorSchema, PerferedCommunication } from "prisma/zod";
import { Field, Form, Select } from "./Form";
import { api } from "~/utils/api";

type DonerT = z.infer<typeof DonorSchema>;
export default function DonerForm() {
  const [donorType, setDonorType] = useState<DonerT["donorType"]>(
    DonorType.enum.INDIVIDUAL,
  );

  const mutation = api.aidDoner.create.useMutation();

  return (
    <Form
      schema={DonorSchema}
      title="Aid Donor Form"
      submitFn={(data) => {
        mutation.mutate(data);
        if (mutation.isError) {
          console.log(mutation.error);
        }
        console.log(mutation.data);
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
          <Field name="principalContactPerson" />
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

      <fieldset>
        <legend>
          <h5>Private Information</h5>
        </legend>

        <div className="grid">
          <Field name="nationality" optional={true} display="Nationality" />
          <div className="grid">
            {donorType === DonorType.enum.ORGANIZATION ? (
              <Field name="abn" display="ABN" type="numbers" optional />
            ) : (
              <Field name="otherinfo" optional />
            )}
          </div>
        </div>
        <div className="grid">
          <Field name="idDocumentNumber1" type="file" optional />
          <Field name="idExpiryDate1" type="date" optional />
        </div>
        <div className="grid">
          <Field name="idDocumentNumber2" type="file" optional />
          <Field name="idExpiryDate2" type="date" optional />
        </div>
        <div className="grid">
          <Field name="idDocumentNumber3" type="file" optional />
          <Field name="idExpiryDate3" type="date" optional />
        </div>
      </fieldset>
    </Form>
  );
}
