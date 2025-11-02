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
      endpoints.management.reports.index,
      reqInit
    ),
  [reportsQueryKey]
);

export const useReportsOverviewQuery = useAppQuery(
  (reqInit?: AppRequestInitProps) =>
    apiHandler.get<Record<ReportStatusType, number>>(
      endpoints.management.reports.overview,
      reqInit
    ),
  [reportsQueryKey, 'overview']
);

export const useUpdateReportStatusMutate = useAppMutation(
  (payload: { id: string; status: ReportStatusType }) =>
    apiHandler.patch(`${endpoints.management.reports.index}/${payload.id}`, {
      status: payload.status,
    }),
  [reportsQueryKey]
);
