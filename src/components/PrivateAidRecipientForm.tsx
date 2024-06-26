import React, { useState } from "react";
import { PrivateAidRecipientSchema } from "prisma/zod";
import _ from "lodash";
import { Field, Form } from "./Form";

export default function PrivateRecipientForm() {
  const [count, setCount] = useState(0);
  const [ids, setIds] = useState(new Array());

  return (
    <Form
      title="Aid Recipient Form - Private Information"
      schema={PrivateAidRecipientSchema}
      submitFn={(data) => {
        console.log(data);
      }}
    >
      <div className="grid">
        <Field name="name" />
        <Field name="nationality" />
      </div>
      <div className="grid">
        <Field name="idDocumentNumber1" />
        <Field name="idExpiryDate1" type="date" />
      </div>
      <div className="grid">
        <Field name="ID 2 DocumentNumber" optional />
        <Field name="ID 2 expiryDate" type="date" optional />
      </div>
      <div className="grid">
        <Field name="ID 3 DocumentNumber" optional />
        <Field name="ID 3 ExpiryDate" type="date" optional />
      </div>
      <h5>
        <a
          onClick={() => {
            setIds([...ids, count]);
            setCount(count + 1);
          }}
        >
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
            </div>
          );
        })}
      </>
    </Form>
  );
}
