import { Prisma, PrismaClient } from "@prisma/client";
import { Form, Field, Select } from "../components/Form";
import { AidCategorySchema, InventoryStatus, AidItem, Kit } from "prisma/zod";
import { api } from "~/utils/api";
import { useState } from "react";

export default function() {
  const mutate = api.aidItem.create.useMutation();
  const getAllQuery = api.aidCategory.getAll.useQuery;
  const categories = getAllQuery()?.data ?? [];
  const [type, setType] = useState("FOOD");
  // TODO
  // const aidKit =

  return (
    <Form
      title="Aid Item"
      schema={AidItem}
      submitFn={(data) => {
        // mutate.mutate(data);
        if (mutate.isError) {
          console.log(mutate.error);
        }
        console.log(mutate.data);
      }}
    >
      <div className="grid">
        <Field name="name" />
        {categories ? (
          <Field
            name="category"
            type="select"
            selections={categories?.map((cate) => cate.name)}
          />
        ) : (
          <div>Loading categories...</div>
        )}
      </div>
      <Field name="quantity" />

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
