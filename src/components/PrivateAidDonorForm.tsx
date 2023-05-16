import React, { useState } from "react";
import z from "zod";
import { DonorType, PrivateAidDonor } from "prisma/zod";
import { Field, Form, Select } from "./Form";
import { api } from "~/utils/api";

type DonerT = z.infer<typeof PrivateAidDonor>;
export default function DonerForm() {
  const mutate = api.privateAidDoner.create.useMutation();
  const [donorType, setDonorType] = useState<DonerT["donorType"]>(
    DonorType.enum.ORGANIZATION,
  );
  return (
    <Form
      schema={PrivateAidDonor}
      title="Donor Form - Private Information"
      submitFn={(data) => {
        mutate.mutate(data);
        if (mutate.isError) {
          console.log(mutate.error);
        }
        console.log(mutate.data);
      }}
    >
      <div className="grid">
        <Field name="name" />
        <Field name="nationality"/>
      </div>
      <div className="grid">
        <Field name="idDocumentNumber1" />
        <Field name="idExpiryDate1" type="date" optional/>
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
       {donorType === DonorType.enum.ORGANIZATION ? (
        <div className="grid">
          <Field name="abn" optional/>
        </div>
      ) : (
        <Field name="AnyOtherImportantInformation" optional/>
      )}
      </div>
    </Form>
  );
}
