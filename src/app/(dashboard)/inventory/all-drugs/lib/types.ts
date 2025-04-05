import { BatchStatus, DrugType } from '@prisma/client'

export interface FetchDrugsParams {
  page?: number
  per_page?: number
  sort?: string
  filters?: {
    query?: string
    drug_name?: string
    drug_brand?: string
    drug_model?: string
    supplier?: string
    drug_type?: DrugType
    batch_status?: BatchStatus
  }
}

export interface FetchDrugsResult {
  data: Drug[]
  totalItems: number
  totalPages: number
}

export interface Drug {
  id: number
  name: string
  brandName: string
  supplierName: string
  batchNumber: string
  stockDate: Date
  expiryDate: Date
  drugType: DrugType
  batchStatus: BatchStatus
  fullAmount: number
  remainingQuantity: number
  wholesalePrice: number
  retailPrice: number
  unitConcentration: number
}

export interface DrugDetails extends Drug {
  brand: string // Replace with actual type from Prisma
  supplier: string // Replace with actual type from Prisma
  drug: DrugType // Replace with actual type from Prisma
  unitConcentration: number // Replace with actual type from Prisma
  issues: Array<{
    id: number
    strategy: string
    quantity: number
    dose: number
  }>
}