export interface iBaseRecord {
  id: string;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
}

export interface iUserRecord extends iBaseRecord {
  username: string;
  email: string;
  full_name: string;
  valid: string;

  pos_code: string;
  pos_name: string;
  org_name: string;
  pos?: iPosRecord;
}

export interface iPosRecord extends iBaseRecord {
  code: string;
  name: string;
  remarks: string;
  parent_code: string;
  parent_name: string;
  organization_code: string;
  organization_name: string;
}

export default {};
