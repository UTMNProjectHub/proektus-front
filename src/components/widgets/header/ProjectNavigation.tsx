import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { Search } from "lucide-react";
import { useState } from "react";
import { useSanctum } from "react-sanctum";

function ProjectNavigation() {
    const {user, authenticated} = useSanctum();
    const [searchQuery, setSearchQuery] = useState("");
    
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // Implement search functionality here
        console.log("Searching for:", searchQuery);
    };

    return (
        <NavigationMenuItem>
            <NavigationMenuTrigger>
                Проекты
            </NavigationMenuTrigger>
            <NavigationMenuContent className="flex flex-col space-y-2">
                <div className="flex flex-row space-x-2">
                    <div className="flex rounded-md bg-muted-foreground px-1 py-1 w-36">
                        <span>Проекты. Проектики.</span>
                    </div>
                    <div className="flex flex-col space-y-1 w-32">
                    <NavigationMenuLink href="/projects">
                        Все проекты
                    </NavigationMenuLink>
                    {
                        authenticated && user &&
                        <>
                            <NavigationMenuLink href="/projects/my">
                            Мои проекты
                            </NavigationMenuLink>
                            <NavigationMenuLink href="/projects/create">
                                Создать проект
                            </NavigationMenuLink>
                        </>

                    }
                    </div>
                </div>
                

                <form onSubmit={handleSearch} className="flex space-x-2 mb-3">
                    <Input
                        type="text"
                        placeholder="Поиск проектов..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full"
                    />
                    <Button type="submit" size="icon" variant="ghost">
                        <Search className="h-4 w-4" />
                    </Button>
                </form>
                
            </NavigationMenuContent>
        </NavigationMenuItem>
    )
}

export default ProjectNavigation;