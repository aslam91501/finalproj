import { Button, Link } from "@nextui-org/react"

export const LandingPage = () => {
    return (
        <div className="h-screen bg-neutral-100 flex items-center justify-center gap-10">
            <Button as={Link} href="/login">Login</Button>
            <Button as={Link} href="/register">Register</Button>
        </div>
    )
}