'use client';

import { Loader2, Plus } from 'lucide-react';
import { useState } from 'react';

import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { UploadButton } from '@/components/upload-button';
import { locationGroups as locationgroupSchema } from '@/db/schema';
import { useBulkCreateLocationgroups } from '@/features/locationgroups/api/use-bulk-create-locationgroups';
import { useBulkDeleteLocationgroups } from '@/features/locationgroups/api/use-bulk-delete-locationgroups';
import { useGetLocationgroups } from '@/features/locationgroups/api/use-get-locationgroups';
import { useNewLocationgroup } from '@/features/locationgroups/hooks/use-new-locationgroup';

import { columns } from './columns';
import { ImportCard } from './import-card';


enum VARIANTS {
  LIST = 'LIST',
  IMPORT = 'IMPORT'
}

const INITIAL_IMPORT_RESULTS = {
  data: [],
  errors: [],
  meta: {}
};

export default function LocationgroupsPage() {
  // const [AccountDialog, confirm] = useSelectAccount();
  const [variant, setVariant] = useState<VARIANTS>(VARIANTS.LIST);
  const [importResults, setImportResults] = useState(INITIAL_IMPORT_RESULTS);

  const onUpload = (results: typeof INITIAL_IMPORT_RESULTS) => {
    setImportResults(results);
    setVariant(VARIANTS.IMPORT);
  };

  const onCancelImport = () => {
    setImportResults(INITIAL_IMPORT_RESULTS);
    setVariant(VARIANTS.LIST);
  };

  const newLocationgroup = useNewLocationgroup();
  const createLocationgroups = useBulkCreateLocationgroups();
  const deleteLocationgroups = useBulkDeleteLocationgroups();
  const locationgroupsQuery = useGetLocationgroups();
  const locationgroups = locationgroupsQuery.data || [];

  const isDisabled = locationgroupsQuery.isLoading || deleteLocationgroups.isPending;

  const onSubmitImport = async (
    values: (typeof locationgroupSchema.$inferInsert)[]
  ) => {
    // const accountId = await confirm();

    // if (!accountId) {
    //   return toast.error('Please select an account to continue.');
    // }

    const data = values.map((value) => ({
      ...value
      // accountId: accountId as string
    }));

    createLocationgroups.mutate(data, {
      onSuccess: () => {
        onCancelImport();
      }
    });
  };

  if (locationgroupsQuery.isLoading) {
    return (
      <div className="max-w-screen-6xl mx-auto w-full pb-10 -mt-24">
        <Card className="border-none drop-shadow-sm">
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <div className="h-[500px] w-full flex items-center justify-center">
              <Loader2 className="size-6 text-slate-300 animate-spin" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (variant === VARIANTS.IMPORT) {
    return (
      <>
        {/* <AccountDialog /> */}
        <ImportCard
          data={importResults.data}
          onCancel={onCancelImport}
          onSubmit={onSubmitImport}
        />
      </>
    );
  }

  return (
    <div className="max-w-screen-6xl mx-auto w-full">
      <div className="flex flex-col px-4 py-2 m-0.5 lg:flex-row lg:items-center lg:justify-between">
        <CardTitle className="text-xl line-clamp-1">Location Groups List</CardTitle>
        <div className="flex flex-col lg:flex-row gap-2 items-center">
          <Button
            onClick={newLocationgroup.onOpen}
            size="sm"
            className="w-full lg:w-auto"
          >
            <Plus className="size-4 mr-2" />
            Add new
          </Button>
          <UploadButton onUpload={onUpload} />
        </div>
      </div>
      <Separator />
      <div className="px-4">
        <DataTable
          placeHolder='Location Group'
          filterKey="name"
          columns={columns}
          data={locationgroups}
          onDelete={(row) => {
            const ids = row.map((r) => r.original.id);
            deleteLocationgroups.mutate({ ids });
          }}
          disabled={isDisabled}
        />
      </div>
    </div>
  );
}
