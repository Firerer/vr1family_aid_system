import React, { FormEventHandler, useState } from "react";
import z from "zod";
import {
  IndividualDonor,
  OrganizationDonor,
  DonorType,
  DonorSchema,
  PerferedCommunication,
} from "prisma/zod";
import camelCaseToDisplay from "~/utils/camelCaseToDisplay";
import { api } from "~/utils/api";

type DonerT = z.infer<typeof DonorSchema>;

const DonerForm: React.FC = () => {
  const [donerType, setDonerType] = useState<DonerT["donorType"]>(
    DonorType.enum.INDIVIDUAL,
  );
  const [error, setError] = useState<Record<keyof DonerT, string[]>>();

  const getDoner = (form: EventTarget & HTMLFormElement): DonerT => {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    for (const element of form.elements) {
      // if (element instanceof HTMLInputElement && element.type === "number") {
      //   data[element.name] = parseFloat(data[element.name]);
      // }
    }
    if (data.donorType === DonorType.enum.ORGANIZATION) {
      delete data.age;
    } else {
      delete data.organizationHeadquarter;
      delete data.principalContactPerson;
    }
    return data as DonerT;
  };

  const parseResult = (_doner: DonerT): [DonerT, typeof error | null] => {
    const ans = (
      _doner?.donorType === DonorType.enum.ORGANIZATION
        ? OrganizationDonor
        : IndividualDonor
    ).safeParse(_doner);
    if (ans.success) {
      return [ans.data, null];
    } else {
      console.error(ans.error.format())
      const err = ans.error.flatten().fieldErrors as typeof error;
      return [_doner, err];
    }
  };

  const useMutation = api.aidDoner.create.useMutation();

  const onEvent: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const [d, err] = parseResult(getDoner(e.currentTarget));
    if (err != null) {
      setError(err);
      console.error(err);
    } else {
      if (e.type === "submit") {
        const res = useMutation.mutate(d);
        useMutation.isError;
        console.log(res);
      }
      setError(undefined);
    }
  };

  const FieldError = ({ field }: { field: keyof DonerT }) => {
    if (error && error[field]) {
      return <small style={{ color: "red" }}>{error[field].at(0)}</small>;
    } else {
      return null;
    }
  };

  return (
    <form onSubmit={onEvent} onChange={onEvent}>
      <h3>Doner Form</h3>
      <div id="col1" className="grid">
        <label>
          {camelCaseToDisplay("name")}
          <input type="text" name={"name"} />
          <FieldError field={"name"} />
        </label>

        <label>
          {camelCaseToDisplay("donorType")}
          <select
            id="donorType"
            name="donorType"
            onChange={(e) =>
              setDonerType(e.target.value as DonerT["donorType"])
            }
          >
            {DonorType.options.map((value) => {
              return (
                <option key={value} value={value}>
                  {value}
                </option>
              );
            })}
          </select>
        </label>
      </div>

      <div id="col2" className="grid">
        <label>
          {"Email"}
          <input type="email" name="email" />
          <FieldError field="email" />
        </label>
        <label>
          {"Phone"}
          <input type="tel" name="phoneNumber" />
          <FieldError field="phoneNumber" />
        </label>
      </div>

      <label>
        {"Mailling Address"}
        <input type="text" name="mailingAddress" />
        <FieldError field="mailingAddress" />
      </label>

      <label>
        {camelCaseToDisplay("preferredCommunication")}
        <select id="preferredCommunication" name="preferredCommunication">
          {PerferedCommunication.options.map((value) => {
            return (
              <option key={value} value={value}>
                {value}
              </option>
            );
          })}
        </select>

        <FieldError field="preferredCommunication" />
      </label>

      {donerType === DonorType.enum.ORGANIZATION ? (
        <div className="grid">
          <label>
            {camelCaseToDisplay("organizationHeadquarter")}
            <input type="text" name="organizationHeadquarter" />
            <FieldError field="organizationHeadquarter" />
          </label>
          <label>
            {camelCaseToDisplay("principalContactPerson")}
            <input type="text" name="principalContactPerson" />
            <FieldError field="principalContactPerson" />
          </label>
        </div>
      ) : (
        <label>
          {"Age"}
          <input type="number" name="age" />
          <FieldError field="age" />
        </label>
      )}

      <input type="submit" value="Submit" />
    </form>
  );
};

export default DonerForm;
