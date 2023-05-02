import { Form, Field } from "../components/Form";
import { AidCategorySchema, InventoryStatus } from "prisma/zod";
import { api } from "~/utils/api";

export default function AidCategoryForm() {
  const mutate = api.aidCategory.create.useMutation();

  return (
    <Form
      title="Aid Category"
      schema={AidCategorySchema}
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
        <Field
          name="inventoryStatus"
          type="select"
          selections={InventoryStatus.options}
        />
      </div>
    </Form>
  );
}
