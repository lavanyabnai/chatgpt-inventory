"use client";

import { useMountedState } from "react-use";

import { EditAccountSheet } from "@/features/accounts/components/edit-account-sheet";
import { NewAccountSheet } from "@/features/accounts/components/new-account-sheet";
import { EditCategorySheet } from "@/features/categories/components/edit-category-sheet";
import { NewCategorySheet } from "@/features/categories/components/new-category-sheet";
import { EditCustomerSheet } from "@/features/customers/components/edit-customer-sheet";
import { NewCustomerSheet } from "@/features/customers/components/new-customer-sheet";
import { EditDemandSheet } from "@/features/demands/components/edit-demand-sheet";
import { NewDemandSheet } from "@/features/demands/components/new-demand-sheet";
import { EditFacilitySheet } from "@/features/facilities/components/edit-facility-sheet";
import { NewFacilitySheet } from "@/features/facilities/components/new-facility-sheet";
import { EditGroupSheet } from "@/features/groups/components/edit-group-sheet";
import { NewGroupSheet } from "@/features/groups/components/new-group-sheet";
import { EditLocationSheet } from "@/features/locations/components/edit-location-sheet";
import { NewLocationSheet } from "@/features/locations/components/new-location-sheet";
import { EditPeriodSheet } from "@/features/periods/components/edit-period-sheet";
import { NewPeriodSheet } from "@/features/periods/components/new-period-sheet";
import { EditProductSheet } from "@/features/products/components/edit-product-sheet";
import { NewProductSheet } from "@/features/products/components/new-product-sheet";
import { EditTransactionSheet } from "@/features/transactions/components/edit-transaction-sheet";
import { NewTransactionSheet } from "@/features/transactions/components/new-transaction-sheet";
import { EditUnitSheet } from "@/features/units/components/edit-unit-sheet";
import { NewUnitSheet } from "@/features/units/components/new-unit-sheet";
import { EditvehicleTypeSheet } from '@/features/vehicleTypes/components/edit-vehicleType-sheet';
import { NewvehicleTypeSheet } from '@/features/vehicleTypes/components/new-vehicleType-sheet';
import { NewBomSheet } from '@/features/boms/components/new-bom-sheet';
import { EditBomSheet } from '@/features/boms/components/edit-bom-sheet';


export const SheetProvider = () => {
  const isMounted = useMountedState();

  if (!isMounted) return null;

  return (
    <>
      <NewAccountSheet />
      <EditAccountSheet />

      <NewCategorySheet />
      <EditCategorySheet />

      <NewTransactionSheet />
      <EditTransactionSheet />


      <NewCustomerSheet />
      <EditCustomerSheet />

      <NewLocationSheet />
      <EditLocationSheet />

      <NewProductSheet />
      <EditProductSheet />

      <NewGroupSheet />
      <EditGroupSheet />

      <NewUnitSheet />
      <EditUnitSheet />

      <NewFacilitySheet />
      <EditFacilitySheet />

      <NewDemandSheet />
      <EditDemandSheet />

      <NewPeriodSheet />
      <EditPeriodSheet />

      <NewvehicleTypeSheet />
      <EditvehicleTypeSheet />

      <NewBomSheet />
      <EditBomSheet />
    </>
  );
};
