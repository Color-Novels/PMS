'use server'

import { DrugType, BatchStatus } from '@prisma/client'
import { prisma } from '@/app/lib/prisma'

// Fetch unique drug types
export async function fetchDrugTypes() {
  try {
    // Based on the schema, drug types are predefined in the DrugType enum
    return Object.values(DrugType)
  } catch (error) {
    console.error('Error fetching drug types:', error)
    throw new Error('Failed to fetch drug types')
  }
}

// Fetch unique drug models
export async function fetchDrugModels() {
  try {
    const result = await prisma.drug.findMany({
      select: { name: true, id: true },
    })

    return result.map(drug => ({ id: drug.id, name: drug.name }))
  } catch (error) {
    console.error('Error fetching drug models:', error)
    throw new Error('Failed to fetch drug models')
  }
}

// Fetch unique drug brands
export async function fetchDrugBrands() {
  try {
    const brands = await prisma.drugBrand.findMany({
      select: { name: true, id: true }
    })
    return brands.map(brand => ({ id: brand.id, name: brand.name }))
  } catch (error) {
    console.error('Error fetching drug brands:', error)
    throw new Error('Failed to fetch drug brands')
  }
}

// Fetch unique suppliers
export async function fetchSuppliers() {
  try {
    const suppliers = await prisma.supplier.findMany({
      select: { name: true, id: true },
      distinct: ['name']
    })
    return suppliers.map(supplier => ({ id: supplier.id, name: supplier.name }))
  } catch (error) {
    console.error('Error fetching suppliers:', error)
    throw new Error('Failed to fetch suppliers')
  }
}

// Fetch batch statuses
export async function fetchBatchStatuses() {
  try {
    // Based on the schema, batch statuses are predefined in the BatchStatus enum
    return Object.values(BatchStatus)
  } catch (error) {
    console.error('Error fetching batch statuses:', error)
    throw new Error('Failed to fetch batch statuses')
  }
}

