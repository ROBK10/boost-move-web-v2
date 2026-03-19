import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

async function main() {
  // Opprett bedrift
  const company = await prisma.company.upsert({
    where: { code: "boostmove-dev" },
    update: {},
    create: {
      name: "Boost Move",
      code: "boostmove-dev",
    },
  })
  console.log(`✅ Bedrift: ${company.name} (kode: ${company.code})`)

  // Opprett Robert
  const passwordHash = await bcrypt.hash("admin123", 10)
  const robert = await prisma.user.upsert({
    where: { email: "robert.kluge@boostmove.no" },
    update: {},
    create: {
      email: "robert.kluge@boostmove.no",
      name: "Robert Kluge",
      passwordHash,
      companyId: company.id,
      role: "admin",
      weeklyGoal: 150,
    },
  })
  console.log(`✅ Bruker: ${robert.name} (${robert.email})`)
  console.log(`   Passord: admin123`)
  console.log(`   Bedriftskode: boostmove-dev`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
