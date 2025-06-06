import { IUser } from "@/models/user/types"

export interface IProjectsResponse {
    current_page: number
    data: IProject[]
    first_page_url: string
    from: number
    last_page: number
    last_page_url: string
    links: ILink[]
    next_page_url: string | null
    path: string
    per_page: number
    prev_page_url: string | null
    to: number
    total: number
}
  
export interface IProject {
    id: number
    name: string
    description: string
    logo: string
    cover: string | null
    created_at: string
    updated_at: string
    deleted_at: string | null
    privacy: "public" | "private"
    users?: IProjectUser[]
    tags?: ITag[]
    urls?: IProjectUrl[]
    // links?: IProjectLink[]
}
  
export interface ILink {
    url?: string
    label: string
    active: boolean
}

export interface ITag {
    id: number
    name: string
    created_at: string
    updated_at: string
    pivot: ITagPivot
}
  
export interface ITagPivot {
  project_id: number
  tag_id: number
}

export interface IProjectUrl {
  id: number
  project_id: number
  repository_url: string
  created_at: string
  updated_at: string
}

// export interface IProjectLink {
//   id: number
//   project_id: number
//   url: string
//   type: string
//   created_at: string
//   updated_at: string
// }

export interface IProjectUser extends IUser {
  id: number
  name: string
  email: string
  email_verified_at: string
  created_at: string
  updated_at: string
  firstname: string
  surname: string
  middlename: string
  avatar?: string
  deleted_at: string | null
  pivot: IUserPivot
}

export interface IUserPivot {
  project_id: number
  user_id: number
  role: string
  created_at: string
  updated_at: string
}

export interface IProjectFile {
  id: number
  project_id: number
  user: IUser
  user_id: number
  s3_key: string
  original_filename: string
  created_at: string
  updated_at: string
}