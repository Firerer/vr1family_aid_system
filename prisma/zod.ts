import { z } from "zod";
const nonempty = z.string().trim().min(1, { message: "Field cannot be empty" });
const date = z.string().datetime({ message: "Invalid date" });
const age = z.coerce
  .number()
  .int({ message: "Age must be an integer" })
  .finite({ message: "Age must be a finite number" })
  .nonnegative({ message: "Age cannot be negative" });

export const KidSchema = z.object({
  name: nonempty,
  age: age,
});

export const AidRecipientSchema = z.object({
  name: z.string(),
  age: z.number(),
  previousAddress: z.string(),
  totalFamilyMembers: z.number(),
  partnerName: z.string().optional(),
  partnerAge: z.number().optional(),
  kids: z.array(KidSchema).optional(),
});

export const DonorType = z.enum(["INDIVIDUAL", "ORGANIZATION"]);
export const PerferedCommunication = z.enum(["EMAIL", "PHONE", "MAIL"]);
const CommonDonorFields = z.object({
  name: nonempty,
  mailingAddress: nonempty,
  phoneNumber: nonempty,
  email: z.string().email(),
  preferredCommunication: PerferedCommunication,
  donorType: DonorType,
});

export const IndividualDonor = CommonDonorFields.extend({
  donorType: z.literal("INDIVIDUAL"),
  age: age,
});

export const OrganizationDonor = CommonDonorFields.extend({
  donorType: z.literal("ORGANIZATION"),
  organizationHeadquarter: nonempty,
  principalContactPerson: nonempty,
});

export const DonorSchema = z.union([IndividualDonor, OrganizationDonor]);

// use case 5
export const InventoryStatus = z.enum(["LOW", "MEDIUM", "HIGH", "EXCESS"]);
export const AidCategorySchema = z.object({
  name: z.string(),
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