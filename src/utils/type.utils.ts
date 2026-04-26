export interface iBaseRecord {
  id: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface iUserRecord extends iBaseRecord {
  username: string;
  email: string;
  fullName: string;
  valid: string;

  posCode: string;
  posName: string;
  orgName: string;
  pos?: iPosRecord;
}

export interface iPosRecord extends iBaseRecord {
  code: string;
  name: string;
  remarks: string;
  parentCode: string;
  parentName: string;
  organizationCode: string;
  organizationName: string;
}

export default {};
