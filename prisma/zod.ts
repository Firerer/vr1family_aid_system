import { z } from "zod";
const nonempty = z.string().trim().min(1, { message: "Field cannot be empty" });
const date = z.string().datetime({ message: "Invalid date" });
const positiveInteger = z.coerce
  .number()
  .int({ message: "Age must be an integer" })
  .finite({ message: "Age must be a finite number" })
  .nonnegative({ message: "Age cannot be negative" });

export const KidSchema = z.object({
  name: nonempty,
  age: positiveInteger,
});

export const AidRecipientSchema = z.object({
  name: nonempty,
  age: positiveInteger,
  previousAddress: nonempty,
  totalFamilyMembers: positiveInteger.gte(1),
  partnerName: nonempty.optional(),
  partnerAge: positiveInteger.optional(),
  kids: z.array(KidSchema).optional(),
});

export const DonorType = z.enum(["INDIVIDUAL", "ORGANIZATION"]);
export const PerferedCommunication = z.enum(["EMAIL", "PHONE", "MAIL"]);
const CommonDonorFields = z.object({
  name: nonempty,
  mailingAddress: nonempty,
  phoneNumber: nonempty,
  email: nonempty.email(),
  preferredCommunication: PerferedCommunication,
  donorType: DonorType,
});

export const IndividualDonor = CommonDonorFields.extend({
  age: positiveInteger,
});

export const OrganizationDonor = CommonDonorFields.extend({
  organizationHeadquarter: nonempty,
  principalContactPerson: nonempty,
});

export const DonorSchema = z.union([IndividualDonor, OrganizationDonor]);

// use case 5
export const InventoryStatus = z.enum(["LOW", "MEDIUM", "HIGH", "EXCESS"]);
export const AidCategorySchema = z.object({
  name: nonempty,
  inventoryStatus: InventoryStatus,
});

export const AidItem = z.object({
  name: z.string(),
  quantity: z.number(),
  aidCategoryId: z.number(),
  expirationDate: date,
  mainIngredients: nonempty,
  allergenInfo: z.string().optional(),
  description: nonempty,
});

export const KitItem = z.object({
  kitId: z.number(),
  itemId: z.number(),
  quantity: z.number(),
});

export const Kit = z.object({
  id: z.number(),
  name: z.string(),
  items: z.array(KitItem),
});
