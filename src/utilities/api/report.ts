import { DataWithPagination } from './../../types/api';
import { useAppQuery } from '@/hooks/api/useQuery';
import { useAppMutation } from '@/hooks/api/useMutation';

// Utilities
import endpoints from '@/utilities/endpoints';
import apiHandler from '@/utilities/safeApiHandler';

// Types
import type { ReportProps } from '@/types/management/report';

const reportsQueryKey = 'reports';

export const useCreateReportMutate = useAppMutation(
  (
    payload: Pick<ReportProps, 'type' | 'reason' | 'description'> & {
      targetId: string;
    }
  ) => apiHandler.post(endpoints.reports, payload),
  [reportsQueryKey]
);

export const useUserReportsQuery = useAppQuery(
  () =>
    apiHandler.get<DataWithPagination<ReportProps>>(`${endpoints.reports}/me`),
  [reportsQueryKey, 'user']
);
