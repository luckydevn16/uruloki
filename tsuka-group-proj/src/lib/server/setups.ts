import { PrismaClient } from "@prisma/client";

/**
 * Server-side function for creating a new setup
 * @param name The setups name
 * @param creatorAddress The wallet address of the user creating the setup
 */
export async function createSetup(name: string, creatorAddress: string) {
    const prisma = new PrismaClient()

    const setupResult = await prisma.strategies.create({
        data: {
            name,
            creator_address: creatorAddress,
            createdAt: new Date(),
            status: "Active"
        }
    })
}