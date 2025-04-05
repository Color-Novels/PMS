import {TableBody, TableRow, TableCell,  } from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {CustomBadge} from "@/app/(dashboard)/_components/CustomBadge";
import {getQueues} from "@/app/lib/actions/queue";


async function TableContents({ currentPage, size }: { currentPage: number, size: number }) {
    const queues = await getQueues((currentPage - 1) * size, size);

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'COMPLETED':
                return 'green';
            case 'IN_PROGRESS':
                return 'yellow';
            default:
                return 'gray';
        }
    };

    return (
        <TableBody>
            {queues.map((queue) => (
                <TableRow key={queue.id}>
                    <TableCell className="font-medium">Queue {queue.id}</TableCell>
                    <TableCell>
                        <CustomBadge text={queue.status} color={getStatusStyle(queue.status)} />
                    </TableCell>
                    <TableCell>{new Date(queue.start).toLocaleDateString()}</TableCell>
                    <TableCell>{queue._count.entries}</TableCell>
                    <TableCell>
                        <Button asChild variant="default" size="sm">
                            <Link href={`/queue/${queue.id}`}>
                                View
                            </Link>
                        </Button>
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    );
}

export default TableContents;