export interface User {
  id: number
  name: string
  firstname: string
  surname: string
  middlename: string | null
  email: string
  created_at: string
  roles: string[]
}
