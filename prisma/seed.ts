import { PrismaClient } from '@prisma/client'
import provincesData from './provinces.json'
import citiesData from './cities.json'

const prisma = new PrismaClient()

async function main() {
  for (const province of provincesData) {
    await prisma.province.create({
      data: province
    })
  }

  for (const city of citiesData) {
    await prisma.city.create({
      data: city
    })
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })