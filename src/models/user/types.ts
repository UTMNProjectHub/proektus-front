export interface IUser {
  id: number
  name: string
  email: string
  email_verified_at: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
  firstname: string
  surname: string
  middlename: string
}

export interface ISanctumUser {
  data: UserData
}

export interface UserData {
  id: number
  name: string
  email: string
  email_verified_at: string | null
  created_at: string
  updated_at: string
  firstname: string
  surname: string
  middlename: string
  deleted_at: string | null
  roles: Role[]
}

export interface Role {
  id: number
  name: string
  guard_name: string
  created_at: string
  updated_at: string
  pivot: Pivot
}

export interface Pivot {
  model_type: string
  model_id: number
  role_id: number
}