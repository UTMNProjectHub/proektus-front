export interface IProjectsResponse {
    current_page: number
    data: IProject[]
    first_page_url: string
    from: number
    last_page: number
    last_page_url: string
    links: ILink[]
    next_page_url: any
    path: string
    per_page: number
    prev_page_url: any
    to: number
    total: number
}
  
export interface IProject {
    id: number
    name: string
    description: string
    logo: string
    cover: any
    created_at: string
    updated_at: string
    deleted_at: any
}
  
interface ILink {
    url?: string
    label: string
    active: boolean
}