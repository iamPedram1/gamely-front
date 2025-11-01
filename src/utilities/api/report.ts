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
