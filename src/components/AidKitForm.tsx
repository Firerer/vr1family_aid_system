import { Form, Field, Select } from "../components/Form";
import { AidCategorySchema, InventoryStatus, Kit } from "prisma/zod";
import { useState } from "react";
import { api } from "~/utils/api";

export default function () {
  const mutate = api.aidKit.create.useMutation();
  const items = api.aidItem.getAllSimple.useQuery();
  const opts = items.data?.map((item) => ({
    display: item.name,
    value: item.id.toString(),
  }));
  const [count, setCount] = useState(0);
  const [ids, setIds] = useState(new Array());

  return (
    <Form
      title="Aid Kit"
      schema={Kit}
      submitFn={(data) => {
        mutate.mutate(data);
        if (mutate.isError) {
          console.log(mutate.error);
        }
      }}
    >
      <div className="grid">
        <Field name="name" />
        <Select name="inventoryStatus" options={InventoryStatus.options} />
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
                <Select
                  name={`kitItems[${i}].itemId`}
                  label="Item"
                  options={opts ?? []}
                />
                <Field name={`kitItems[${i}].quantity`} type="number" />
              </div>
            </div>
          );
        })}
      </>
    </Form>
  );
}
