import { useAppQuery } from '@/hooks/api/useQuery';
import { useAppMutation } from '@/hooks/api/useMutation';

// Utilities
import endpoints from '@/utilities/endpoints';
import apiHandler from '@/utilities/safeApiHandler';

// Types
import type { DataWithPagination } from '@/types/api';
import type { ReportProps, ReportStatusType } from '@/types/management/report';
import type { AppRequestInitProps } from '@/utilities/apiHandler';

const reportsQueryKey = 'reports';

export const useReportsQuery = useAppQuery(
  (reqInit: AppRequestInitProps) =>
    apiHandler.get<DataWithPagination<ReportProps>>(
      endpoints.management.reports,
      reqInit
    ),
  [reportsQueryKey]
);

export const useUpdateReportStatusMutate = useAppMutation(
  (payload: { id: string; status: ReportStatusType }) =>
    apiHandler.patch(`${endpoints.reports}/${payload.id}`, {
      status: payload.status,
    }),
  [reportsQueryKey]
);
