import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  AidCategorySchema,
  AidRecipientSchema,
  DonorSchema,
  AidItem,
  Kit,
} from "prisma/zod";
import { Prisma } from "@prisma/client";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
Prisma.AidCategoryScalarFieldEnum;
export const appRouter = createTRPCRouter({
  aidItem: createTRPCRouter({
    create: publicProcedure.input(AidItem).mutation(async ({ input, ctx }) => {
      return await ctx.prisma.aidItem.create({ data: input });
    }),
    getAll: publicProcedure.query(async ({ ctx }) => {
      return await ctx.prisma.aidItem.findMany();
    }),
  }),
  aidKit: publicProcedure.input(Kit).mutation(async ({ input, ctx }) => {
    return await ctx.prisma.kit.create({ data: input });
  }),
  aidCategory: createTRPCRouter({
    create: publicProcedure
      .input(AidCategorySchema)
      .mutation(async ({ input, ctx }) => {
        return await ctx.prisma.aidCategory.create({ data: input });
      }),
    getAll: publicProcedure.query(async ({ ctx }) => {
      return await ctx.prisma.aidCategory.findMany();
    }),
  }),

  aidRecipient: createTRPCRouter({
    create: publicProcedure
      .input(AidRecipientSchema)
      .mutation(async ({ input, ctx }) => {
        const data: Prisma.AidRecipientCreateInput = {
          ...input,
          kids: {
            create: input.kids,
          },
        };
        const ans = await ctx.prisma.aidRecipient.create({
          data: data,
        });
        try {
          return ans;
        } catch (error) {
          console.log(error);
        }
      }),
  }),
  aidDoner: createTRPCRouter({
    create: publicProcedure
      .input(DonorSchema)
      .mutation(async ({ input, ctx }) => {
        const ans = ctx.prisma.donor.create({
          data: input,
        });
        try {
          return ans;
        } catch (error) {
          console.log(error);
        }
      }),
  }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
