'use server'

import { Drug, FetchDrugsParams, FetchDrugsResult } from './types'
import { BatchStatus, DrugType, Prisma } from '@prisma/client'
import { prisma } from '@/app/lib/prisma'


export async function fetchDrugs({
  page = 1,
  per_page = 10,
  sort = 'expiry:asc',
  filters = {}
}: FetchDrugsParams): Promise<FetchDrugsResult> {
  try {

    // Create a type-safe where condition
    const whereConditions: Prisma.BatchWhereInput = {
      ...(filters.drug_model && {
        drug: {
          id: {
            in: filters.drug_model.split(',').map(id => parseInt(id.trim())),
          }
        }
      }),
      ...(filters.drug_brand && {
        drugBrand: {
          id: {
            in: filters.drug_brand.split(',').map(id => parseInt(id.trim())),
          }
        }
      }),
      ...(filters.supplier && {
        Supplier: {
          id: {
            in: filters.supplier.split(',').map(id => parseInt(id.trim())),
          }
        }
      }),
      ...(filters.drug_type && { type: { in: filters.drug_type.split(',').map(name => name.trim() as DrugType) } }),
      ...(filters.batch_status && { status: { in: filters.batch_status.split(',').map(name => name.trim() as BatchStatus) } }),
      ...(filters.query && {
        OR: [
          { drug: { name: { contains: filters.query, mode: 'insensitive' } } },
          { drugBrand: { name: { contains: filters.query, mode: 'insensitive' } } },
          { number: { contains: filters.query, mode: 'insensitive' } }
        ]
      })
    };


    // Prepare sorting
    const [sortField, sortDirection] = sort ? sort.split(':') : ['id', 'desc'];
    const orderBy: Prisma.BatchOrderByWithRelationInput =
      sortField === 'name' ?
        { drug: { name: sortDirection as Prisma.SortOrder } } :
        sortField === 'expiry' ?
          { expiry: sortDirection as Prisma.SortOrder } :
          sortField === 'stockDate' ?
            { stockDate: sortDirection as Prisma.SortOrder } :
            sortField === 'remaining_amount' ?
              { remainingQuantity: sortDirection as Prisma.SortOrder } :
              { id: 'desc' };


    // Fetch total count for pagination
    const totalItems = await prisma.batch.count({ where: whereConditions })
    const totalPages = Math.ceil(totalItems / per_page)

    // Fetch paginated drugs with related data
    const batches = await prisma.batch.findMany({
      where: whereConditions,
      orderBy,
      skip: (page - 1) * per_page,
      take: per_page,
      include: {
        drug: true,
        drugBrand: true,
        Supplier: true,
        unitConcentration: true
      }
    })

    // Transform Prisma Batch to Drug type
    const drugs: Drug[] = batches.map(batch => ({
      id: batch.id,
      name: batch.drug.name,
      brandName: batch.drugBrand.name,
      supplierName: batch.Supplier.name,
      batchNumber: batch.number,
      stockDate: batch.stockDate,
      expiryDate: batch.expiry,
      drugType: batch.type,
      batchStatus: batch.status,
      fullAmount: batch.fullAmount,
      remainingQuantity: batch.remainingQuantity,
      wholesalePrice: batch.wholesalePrice,
      retailPrice: batch.retailPrice,
      unitConcentration: batch.unitConcentration.concentration
    }))

    return {
      data: drugs,
      totalItems,
      totalPages
    }
  } catch (error) {
    console.error('Error fetching drugs:', error)
    throw error
  }
}