export type TenantInfo = {
  id: string;
  name: string;
  type: 'SHARED' | 'DEDICATED';
  db_url?: string;
};
