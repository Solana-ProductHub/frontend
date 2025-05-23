import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { ModeToggle } from "./mode-toggle"

export default function Navbar() {
    const navigate = useNavigate()

    return (
        <nav className="w-full flex items-center justify-between px-6 py-3 border-b">
            {/* Logo */}
            <div className="font-bold text-xl text-primary">
                ProHub
            </div>

            {/* Search Bar */}
            <div className="flex-1 flex justify-center px-4">
                <Input
                    type="search"
                    placeholder="Search products by name..."
                    className="max-w-md w-full"
                />
            </div>

            {/* List Product Button */}
            <div className="flex items-center space-x-4">
                <Button onClick={() => navigate("/list")} className="dark:bg-secondary dark:text-white bg-black text-secondary">
                    List your product
                </Button>

                <ModeToggle />
            </div>
        </nav>
    )
}