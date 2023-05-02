import { Form, Field } from "../components/Form";
import { AidCategorySchema, InventoryStatus, Kit } from "prisma/zod";
import { useState } from "react";
import { api } from "~/utils/api";

export default function() {
  const mutate = api.aidKit.useMutation();
  const [count, setCount] = useState(0);
  const [ids, setIds] = useState(new Array());

  return (
    <Form
      title="Aid Kit"
      schema={Kit}
      submitFn={(data) => {
        // mutate.mutate(data);
        if (mutate.isError) {
          console.log(mutate.error);
        }
        console.log(data);
      }}
    >
      <div className="grid">
        <Field name="name" />
        <Field
          name="inventoryStatus"
          type="select"
          selections={InventoryStatus.options}
        />
      </div>

      <h5>
        <a
          onClick={() => {
            setIds([...ids, count]);
            setCount(count + 1);
          }}
        >
          Add Item
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
                {"Item"} {i}
              </div>
            </div>
          );
        })}
      </>
    </Form>
  );
}
