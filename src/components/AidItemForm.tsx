import { Form, Field, Select } from "../components/Form";
import * as zod from "prisma/zod";
import { api } from "~/utils/api";
import { useState } from "react";

export default function () {
  const mutation = api.aidItem.create.useMutation();
  const getAllQuery = api.aidCategory.getAll.useQuery;
  const categories = getAllQuery()?.data ?? [];
  const [type, setType] = useState("FOOD");

  return (
    <Form
      title="Aid Item"
      schema={zod.AidItem}
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
        {categories ? (
          <Select
            name="category"
            type="select"
            options={categories?.map((cate) => cate.name)}
          />
        ) : (
          <div>Loading categories...</div>
        )}
      </div>
      <Field name="quantity" type="number" />

      <Select
        type="select"
        name="aidItemType"
        options={["FOOD", "CLOTHING"]}
        onChange={(e) => setType(e.target.value)}
      />

      {type === "FOOD" ? (
        <>
          <Field name="brand" />
          <Field name="expiryDate" type="date" />
          <Field name="mainIngredients" />
          <Field name="allergenInfo" />
        </>
      ) : (
        <>
          <Field name="alphabeticSize" placeholder="Such as XL, XXL" />
          <Field name="numericSize" type="number" step="0.5" />
        </>
      )}
    </Form>
  );
}
