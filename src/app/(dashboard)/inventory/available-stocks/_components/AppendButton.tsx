'use client'

import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'  // Changed from 'next/router'
import { Button } from '@/components/ui/button'

function AppendButton({ append }: { append: string }) {
    const pathname = usePathname()
    const router = useRouter()

    const handleClick = () => {
        const newPath = `${pathname}/${append}`
        router.push(newPath)
    }

    return (
        <Button 
            onClick={handleClick}
            className="w-full mt-6"  // Simplified className since we're using shadcn/ui Button
        >
            View Details
        </Button>
    )
}

export default AppendButton