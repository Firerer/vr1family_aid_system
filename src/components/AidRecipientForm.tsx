import React, { FormEventHandler, useState } from "react";
import z, { ZodFormattedError } from "zod";
import { AidRecipientSchema } from "prisma/zod";
import camelCaseToDisplay from "~/utils/camelCaseToDisplay";
import { api } from "~/utils/api";
import _, { get, set } from "lodash";

type RecipientT = z.infer<typeof AidRecipientSchema>;

const RecipientForm: React.FC = () => {
  const [error, setError] = useState<ZodFormattedError<RecipientT>>();
  const [kids, setKids] = useState<RecipientT["kids"]>([{ name: "", age: 0 }]);
  let f: React.RefObject<HTMLFormElement> = React.createRef();

  const getDoner = (form: EventTarget & HTMLFormElement): RecipientT => {
    const formData = new FormData(form);
    let data = {};
    for (const element of form.elements) {
      if (!(element instanceof HTMLInputElement)) continue;
      // @ts-ignore
      if (!element.required && !formData.get(element.name)) {
        continue;
      }
      console.log(formData);
      if (element.type === "number") {
        console.log("set num", element.name, element.value);
        console.log("get: ", get(data, element.name));
        data = set(data, element.name, parseFloat(element.value));
        console.log("after set", data);
      } else if (element.type === "file") {
        console.log("set file", element.name, element.value, element.files);
        const file = element.files?.[0];
      } else {
        data = set(data, element.name, element.value);
      }
    }
    return data as RecipientT;
  };

  const parseResult = (
    _doner: RecipientT,
  ): [RecipientT, typeof error | null] => {
    const ans = AidRecipientSchema.safeParse(_doner);
    if (ans.success) {
      return [ans.data, null];
    } else {
      const err = ans.error.format();

      return [_doner, err];
    }
  };

  const mutate = api.aidRecipient.create.useMutation().mutate;

  const onEvent: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const [d, err] = parseResult(getDoner(e.currentTarget));
    if (err != null) {
      setError(err);
      console.error(err);
    } else {
      if (e.type === "submit") {
        const res = mutate(d);
        console.log(res);
      }
      setError(undefined);
    }
  };

  const FieldError = ({ field }: { field: string }) => {
    const fieldError = get(error, field);
    if (error && fieldError) {
      return <small style={{ color: "red" }}>{fieldError._errors.at(0)}</small>;
    } else {
      return null;
    }
  };
  _.isArray;

  return (
    <form onSubmit={onEvent} onChange={onEvent} ref={f}>
      <h3>Recipient Form</h3>
      <div id="col1" className="grid">
        <label>
          {"Name"}
          <input type="text" name={"name"} />
          <FieldError field={"name"} />
        </label>

        <label>
          {"Age"}
          <input type="number" name="age" />
          <FieldError field="age" />
        </label>
      </div>

      <div id="col2" className="grid">
        <label>
          {camelCaseToDisplay("previousAddress")}
          <input type="previousAddress" name="previousAddress" />
          <FieldError field="previousAddress" />
        </label>
      </div>

      <div className="grid">
        <label>
          {camelCaseToDisplay("totalFamilyMembers")}
          <input name="totalFamilyMembers" type="number" />
          <FieldError field="totalFamilyMembers" />
        </label>
        <label>
          {camelCaseToDisplay("partnerName")} {"(Optional)"}
          <input name="partnerName" required={false} />
          <FieldError field="partnerName" />
        </label>
        <label>
          {camelCaseToDisplay("partnerAge")} {"(Optional)"}
          <input name="partnerAge" type="number" required={false} />
          <FieldError field="partnerAge" />
        </label>
      </div>

      <li>
        <h5>
          <a onClick={() => setKids([...kids, { name: "", age: 0 }])}>
            Add Kid{/*BUG when remove*/}
          </a>
        </h5>
        {kids?.map((kid, i) => {
          return (
            <div key={i}>
              <a
                style={{ maxHeight: "3rem" }}
                onClick={(e) => {
                  e.currentTarget.parentElement!.remove();
                }}
                className="contrast"
              >
                {"Remove"}
              </a>
              <div className="grid">
                <div>
                  <input
                    name={`kids[${i}].name`}
                    type="text"
                    placeholder="name"
                  />
                  <FieldError field={`kids[${i}].name`} />
                </div>
                <div>
                  <input
                    name={`kids[${i}].age`}
                    type="number"
                    placeholder="age"
                  />
                  <FieldError field={`kids[${i}].age`} />
                </div>
              </div>
            </div>
          );
        })}
      </li>

      <input type="submit" value="Submit" />
    </form>
  );
};

export default RecipientForm;
