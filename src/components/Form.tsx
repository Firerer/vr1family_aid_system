import React, {
  useState,
  FormEventHandler,
  FC,
  HTMLInputTypeAttribute,
} from "react";
import camelCaseToDisplay from "../utils/camelCaseToDisplay";
import z from "zod";
import _, { get } from "lodash";

type SelectAttr = {
  name: string;
  optional?: boolean;
  selections: string[] | { display: string; value: string }[];
} & React.InputHTMLAttributes<HTMLSelectElement>;
export function Select(props: SelectAttr) {
  const { name, optional, selections, ...rest } = props;
  return (
    <label>
      {camelCaseToDisplay(name)}
      <select name={name} {...rest}>
        {selections.map((value) => {
          const v = typeof value === "string" ? value : value.value;
          const display = typeof value === "string" ? value : value.display;
          return (
            <option key={v} value={v}>
              {display}
            </option>
          );
        })}
      </select>
    </label>
  );
}

type FieldType = {
  name: string;
  optional?: boolean;
  type?: React.HTMLInputTypeAttribute;
  step?: string;
  selections?: string[] | { display: string; value: string }[];
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
} & React.InputHTMLAttributes<HTMLInputElement>;
export function Field(props: FieldType) {
  const { name, optional, ...rest } = props;
  return (
    <label>
      {camelCaseToDisplay(name)}
      <input name={name} required={!optional} autoComplete="off" {...rest} />
    </label>
  );
}

function parseFormData<
  Schema extends z.ZodTypeAny,
  Data = z.infer<Schema>,
  Error = z.ZodFormattedError<Schema>,
>(schema: Schema, form: EventTarget & HTMLFormElement): [Data, Error | null] {
  const data = {};
  new FormData(form).forEach((value, key) => {
    _.set(data, key, value);
  });
  const res = schema.safeParse(data);
  if (res.success) {
    return [res.data, null];
  } else {
    // @ts-ignore
    return [data, res.error.format()];
  }
}

export function Form<Schema extends z.ZodTypeAny, Data = z.infer<Schema>>({
  schema,
  title,
  submitFn,
  children,
}: {
  schema: Schema;
  submitFn: (data: Data) => void;
  title: string;
  children: React.ReactElement[] | React.ReactElement;
}) {
  const onEvent: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    console.log(e.type);
    const [data, err] = parseFormData(schema, e.currentTarget);
    const target = e.target;
    if (target instanceof HTMLInputElement || target instanceof HTMLSelectElement) {
      const targetErr = get(err, target.name)?._errors.at(0);
      const targetVal = get(data, target.name);
      if (targetErr) {
        console.error("Err: ", targetErr);
        target.setCustomValidity(targetErr);
        target.reportValidity();
      } else {
        console.log("normal");
        target.setCustomValidity("");
        target.reportValidity();
        target.value = targetVal;
      }
    }
    if (e.type === "submit" && err === null) {
      submitFn(data);
    } else {
      console.log(err?.array);
      window.alert("unhandled error" + err?.array?.[0].toString());
    }
  };

  return (
    <form onSubmit={onEvent} onChange={onEvent}>
      <h3>{title}</h3>
      {children}
      <input type="submit" value={"Submit"} />
    </form>
  );
}
