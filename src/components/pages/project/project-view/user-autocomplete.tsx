"use client"

import type React from "react"

import {useState, useEffect, useRef} from "react"
import {X, Search, Loader2} from "lucide-react"
import {Badge} from "@/components/ui/badge"
import {Avatar} from "@/components/ui/avatar"
import {AvatarImage, AvatarFallback} from "@/components/ui/avatar"
import {cn} from "@/lib/utils"
import {IUser} from "../../../../models/user/types"
import axios from "axios"
import {Button} from "@/components/ui/button"
import {toast} from "sonner";

interface UserAutocompleteProps {
    onSelectionChange?: (selectedUsers: IUser[]) => void
    placeholder?: string
    className?: string
    projectID?: number
    selectedUsers: IUser[]
    setSelectedUsers: React.Dispatch<React.SetStateAction<IUser[]>>
}

export function UserAutocomplete({
                                     onSelectionChange,
                                     placeholder = "Введите имя пользователя...",
                                     className,
                                     projectID,
                                     selectedUsers,
                                     setSelectedUsers,
                                 }: UserAutocompleteProps) {
    const [query, setQuery] = useState("")
    const [results, setResults] = useState<IUser[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [activeIndex, setActiveIndex] = useState(-1)
    const inputRef = useRef<HTMLInputElement>(null)
    const resultsRef = useRef<HTMLDivElement>(null)

    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async () => {
        if (selectedUsers.length === 0) return

        setIsSubmitting(true)
        try {
            const response = await axios.post(`/api/projects/${projectID}/users`, {
                users: selectedUsers.map((user) => user.id),
            })

            if (response.status === 200) {
                toast.success('Пользователи успешно добавлены')
                setSelectedUsers([])
                setQuery("")
                setIsOpen(false)
            } else {
                toast.error('Ошибка при добавлении пользователей')
            }
        } catch (error) {
            toast.error("Ошибка при добавлении пользователей, попробуйте позже")
        } finally {
            setIsSubmitting(false)
        }
    }

    // Fetch users when query changes
    useEffect(() => {
        const fetchUsers = async () => {
            if (query.trim() === "") {
                setResults([])
                setIsLoading(false)
                return
            }

            setIsLoading(true)
            try {
                const response = await axios.get(`/api/users/search?username=${encodeURIComponent(query)}`)
                if (response.status != 200) throw new Error("Failed to fetch users")
                const data = await response.data
                console.log(data)
                setResults(data.users)
            } catch (error) {
                console.error("Error fetching users:", error)
                setResults([])
            } finally {
                setIsLoading(false)
            }
        }

        const debounceTimer = setTimeout(fetchUsers, 100)
        return () => clearTimeout(debounceTimer)
    }, [query])

    // Notify parent component when selection changes
    useEffect(() => {
        onSelectionChange?.(selectedUsers)
    }, [selectedUsers, onSelectionChange])

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                resultsRef.current &&
                !resultsRef.current.contains(event.target as Node) &&
                !inputRef.current?.contains(event.target as Node)
            ) {
                setIsOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const selectUser = (user: IUser) => {
        if (!selectedUsers.some((selected) => selected.id === user.id)) {
            setSelectedUsers([...selectedUsers, user])
        }
        setQuery("")
        setIsOpen(false)
        inputRef.current?.focus()
    }

    const removeUser = (userId: number) => {
        setSelectedUsers(selectedUsers.filter((user) => user.id !== userId))
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        // Handle keyboard navigation
        if (e.key === "ArrowDown") {
            e.preventDefault()
            setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev))
        } else if (e.key === "ArrowUp") {
            e.preventDefault()
            setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev))
        } else if (e.key === "Enter" && activeIndex >= 0) {
            e.preventDefault()
            selectUser(results[activeIndex])
        } else if (e.key === "Escape") {
            setIsOpen(false)
        } else if (e.key === "Backspace" && query === "" && selectedUsers.length > 0) {
            // Remove the last selected user when backspace is pressed and input is empty
            removeUser(selectedUsers[selectedUsers.length - 1].id)
        }
    }

    return (
        <div className={cn("relative w-full", className)}>
            <div
                className="flex flex-wrap items-center gap-1 p-2 border rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                {selectedUsers.map((user) => (
                    <Badge key={user.id} variant="secondary" className="flex items-center gap-1 px-2 py-1">
                        <Avatar className="w-5 h-5">
                            <AvatarImage src={"/placeholder.svg"} alt={user.name}/>
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{user.name}</span>
                        <button
                            type="button"
                            onClick={() => removeUser(user.id)}
                            className="ml-1 rounded-full hover:bg-muted"
                            aria-label={`Remove ${user.name}`}
                        >
                            <X className="w-3 h-3"/>
                        </button>
                    </Badge>
                ))}

                {/* Search input */}
                <div className="relative flex-1 min-w-[120px]">
                    <div className="absolute left-0 flex items-center h-full pointer-events-none">
                        {query === "" && selectedUsers.length === 0 &&
                            <Search className="w-4 h-4 text-muted-foreground"/>}
                    </div>
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value)
                            setIsOpen(true)
                            setActiveIndex(-1)
                        }}
                        onFocus={() => query && setIsOpen(true)}
                        onKeyDown={handleKeyDown}
                        className={cn(
                            "w-full bg-transparent outline-none",
                            query === "" && selectedUsers.length === 0 ? "pl-6" : "pl-1",
                        )}
                        placeholder={selectedUsers.length === 0 ? placeholder : ""}
                    />
                </div>
                {selectedUsers.length > 0 && (
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="ml-auto flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                        aria-label="Submit selected users"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-3 h-3 animate-spin"/>
                                <span>Submitting...</span>
                            </>
                        ) : (
                            <span>Добавить</span>
                        )}
                    </button>
                )}
            </div>

            {/* Results dropdown */}
            {isOpen && (
                <div
                    ref={resultsRef}
                    className="absolute z-10 w-full mt-1 overflow-auto bg-background border rounded-md shadow-md max-h-60"
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center p-4">
                            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground"/>
                        </div>
                    ) : results.length > 0 ? (
                        <ul>
                            {results.map((user, index) => (
                                <li key={user.id}>
                                    <button
                                        type="button"
                                        onClick={() => selectUser(user)}
                                        onMouseEnter={() => setActiveIndex(index)}
                                        className={cn(
                                            "w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-muted",
                                            activeIndex === index && "bg-muted",
                                        )}
                                    >
                                        <Avatar className="w-6 h-6">
                                            {/* <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} /> */}
                                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-medium">{user.name}</div>
                                            <div className="text-xs text-muted-foreground">{user.email}</div>
                                        </div>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : query !== "" ? (
                        <div className="p-3 text-sm text-center text-muted-foreground">Пользователи не найдены</div>
                    ) : null}
                </div>
            )}
        </div>
    )
}
