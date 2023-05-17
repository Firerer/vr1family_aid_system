import React, { useState } from "react";
import { AidRecipientSchema } from "prisma/zod";
import _ from "lodash";
import { Field, Form } from "./Form";
import { api } from "~/utils/api";
import { date, z } from "zod";

export default function RecipientForm() {
  const [count, setCount] = useState(0);
  const [ids, setIds] = useState(new Array());
  const mutation = api.aidRecipient.create.useMutation();

  return (
    <Form
      title="Aid Recipient Form"
      schema={AidRecipientSchema}
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
        <Field name="age" type="number" />
      </div>
      <Field name="previousAddress" />
      <div className="grid">
        <Field name="totalFamilyMembers" type="number" />
        <Field name="partnerName" optional />
        <Field name="partnerAge" type="number" optional />
      </div>
      <h5>
        <a
          onClick={() => {
            setIds([...ids, count]);
            setCount(count + 1);
          }}
        >
          Add Kid
        </a>
      </h5>
      <>
        {ids?.map((n, i) => {
          return (
            <div key={n}>
              <a
                style={{ maxHeight: "3rem" }}
                onClick={() => setIds(ids.filter((id) => id !== n))}
                className="contrast"
              >
                {"Remove"}
              </a>
              <div className="grid">
                <Field name={`kids[${i}].name`} />
                <Field name={`kids[${i}].age`} type="number" />
              </div>
            </div>
          );
        })}
      </>

      <fieldset>
        <legend>
          <h5>Private Information</h5>
        </legend>

        <div className="grid">
          <Field name="nationality" optional />
        </div>
        <div className="grid">
          <Field name="idDocumentNumber1" type="file" optional />
          <Field name="idExpiryDate1" type="date" optional />
        </div>
        <div className="grid">
          <Field name="ID 2 DocumentNumber" optional />
          <Field name="ID 2 expiryDate" type="date" optional />
        </div>
        <div className="grid">
          <Field name="ID 3 DocumentNumber" optional />
          <Field name="ID 3 ExpiryDate" type="date" optional />
        </div>
      </fieldset>
    </Form>
  );
}
