export interface Operation {
  id: string;
  status: 'RECEIVED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  rows_inserted: number;
  rows_rejected: number;
  duration_ms: number;
  error_summary?: string;
  created_at: string;
}

export interface Summary {
  total_policies: number;
  total_premium_usd: number;
  count_by_status: Record<string, number>;
  premium_by_type: Record<string, number>;
}


export interface Policy {
  id: string;
  policy_number: string;
  customer: string;
  policy_type: 'Property' | 'Auto';
  start_date: string;
  end_date: string;
  premium_usd: number;
  status: string;
  insured_value_usd: number;
  created_at: string;
}

export interface UploadError {
  row_number: number;
  field: string;
  code: string;
  message: string;
}

export interface UploadData {
  operation_id: string;
  correlation_id: string;
  inserted_count: number;
  rejected_count: number;
  errors: UploadError[];
}

export interface ApiResponse {
  message?: string;
}

export interface PoliciesResponse {
  items: Policy[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
}