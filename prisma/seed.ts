import { PrismaClient } from '@prisma/client'
import brandsAndModels from "./brandsAndModels.json"
import provincesData from './provinces.json'
import citiesData from './cities.json'
import categories from './categories.json'
import buildYear from "./buildYear.json"
import fuels from "./fuels.json"

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

  for (const category of categories) {
    await prisma.autoGalleryCategory.create({
      data: category
    })
  }

  for (const fuel of fuels) {
    await prisma.fuelType.create({
      data: fuel
    })
  }

  for (const year of buildYear) {
    await prisma.buildYear.create({
      data: year
    })
  }

  for (const brandAndModels of brandsAndModels) {
    await prisma.brand.create({
      data: {
        id: brandAndModels.id,
        name: brandAndModels.brandName,
        models: {
          create: brandAndModels.models
        }
      }
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