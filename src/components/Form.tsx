import React, { FormEventHandler } from "react";
import camelCaseToDisplay from "../utils/camelCaseToDisplay";
import z from "zod";
import _, { get, isEmpty, isNil } from "lodash";
import { env } from "process";

export type SelectAttr = {
  name: string;
  optional?: boolean;
  options: string[] | { display: string; value: string }[];
  ref?: React.RefObject<HTMLSelectElement>;
} & React.InputHTMLAttributes<HTMLSelectElement>;
export function Select(props: SelectAttr) {
  const { name, optional, options: selections, ...rest } = props;
  const displayName = camelCaseToDisplay(name.split(".")?.at(-1) ?? name);
  return (
    <label>
      {displayName} {optional && "(optional)"}
      <select name={name} required={!optional} {...rest}>
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

export type FieldType = {
  name: string;
  optional?: boolean;
  display?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export function Field(props: FieldType) {
  const { name, optional, display, ...rest } = props;
  const displayName =
    display ?? camelCaseToDisplay(name.split(".")?.at(-1) ?? name);
  return (
    <label>
      {displayName} {optional && "(optional)"}
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
    if (isNil(value) || isEmpty(value)) return;
    _.set(data, key, value);
  });

  form.querySelectorAll("input[type='file']").forEach((el) => {
    if (el instanceof HTMLInputElement) {
      const value = el.files?.item(0)?.name;
      const key = el.name;
      console.log(key, value);
      _.set(data, key, value);
    }
  });

  const res = schema.safeParse(data);
  if (res.success) {
    return [res.data, null];
  } else {
    console.error(res.error.format());
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
    const target = e.target;
    const [data, err] = parseFormData(schema, e.currentTarget);
    if (
      env.NODE_ENV == "development" ||
      window.location.hostname == "localhost"
    )
      console.log("Data: ", data, "Err: ", err);
    if (
      target instanceof HTMLInputElement ||
      target instanceof HTMLSelectElement
    ) {
      const targetErr = get(err, target.name)?._errors.at(0);
      if (targetErr) {
        target.setCustomValidity(targetErr);
        target.reportValidity();
      } else {
        target.setCustomValidity("");
        target.reportValidity();
        // const targetVal = get(data, target.name);
        // target.value = targetVal ?? "";
      }
    } else if (target instanceof HTMLFormElement) {
      if (e.type === "submit" && err === null) {
        submitFn(data);
        if (
          target.reset &&
          (env.NODE_ENV == "production" ||
            window.location.hostname == "localhost")
        )
          target.reset();
      }
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
