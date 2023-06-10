export interface UserAttributes {
  id: string;
  first_name: string;
  last_name: string;
  password: string;
  username: string;
  gender: string;
  service: string;
  email: string;
  phone: string;
  birth_date: Date;
  is_admin: boolean;
  is_blocked: boolean;
  avatar_image: string;
}

export interface GroupAttributes {
  id: string;
  name: string;
  description: string;
  data_created: Date;
}

export interface BillUsersDebt {
  id: string;
  debt: number;
}

export interface BillAttributes {
  id: string;
  name: string;
  description: string;
  data_created: Date;
  data_end: Date;
  bill_image: string;
  currency_type: string;
  currency_code: string;
  debt: number;
  code_qr: string;
  owner_id: string;
  group_id: string;
}

export interface BillPostPayload {
  id: string;
  name: string;
  description: string;
  data_created: Date;
  data_end: Date;
  bill_image: string;
  currency_type: string;
  currency_code: string;
  debt: number;
  code_qr: string;
  owner_id: string;
  group_id: string;
  usersIdDebtList: BillUsersDebt[];
}

export type ErrorType = string | { error: string };

export type UpdateBillRequest = {
  params: {
    id: string;
  };
  body: Partial<BillAttributes>;
};

export interface BillUsersAttributes {
  id: string;
  debt: number;
  is_regulated: boolean;
  bill_id: string;
  user_id: string;
}

export interface BillUsersBillResponse {
  billUsers: BillUsersAttributes[];
  users: UserAttributes[];
}
