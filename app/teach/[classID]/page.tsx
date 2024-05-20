"use client"
import { redirect, useParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { ChevronLeftIcon, Pencil1Icon, PersonIcon, PlusIcon} from "@radix-ui/react-icons"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { MouseEvent } from "react"
import { usePathname } from 'next/navigation'


function ClassHome() {
    const { data: session, status, update } = useSession()
    if (status !== "authenticated") redirect("/")
         
const invoices = [
    {
      invoice: "INV001",
      paymentStatus: "Paid",
      totalAmount: "$250.00",
      paymentMethod: "Credit Card",
    },
    {
      invoice: "INV002",
      paymentStatus: "Pending",
      totalAmount: "$150.00",
      paymentMethod: "PayPal",
    },
    {
      invoice: "INV003",
      paymentStatus: "Unpaid",
      totalAmount: "$350.00",
      paymentMethod: "Bank Transfer",
    },
    {
      invoice: "INV004",
      paymentStatus: "Paid",
      totalAmount: "$450.00",
      paymentMethod: "Credit Card",
    },
    {
      invoice: "INV005",
      paymentStatus: "Paid",
      totalAmount: "$550.00",
      paymentMethod: "PayPal",
    },
    {
      invoice: "INV006",
      paymentStatus: "Pending",
      totalAmount: "$200.00",
      paymentMethod: "Bank Transfer",
    },
    {
      invoice: "INV007",
      paymentStatus: "Unpaid",
      totalAmount: "$300.00",
      paymentMethod: "Credit Card",
    },
  ]

  const router = useRouter();
  const pathname = usePathname();

  const openProject = (e: MouseEvent, lessonId: string) => {
    e.preventDefault();
    router.push(`${pathname}/class1`);
  }
   

    // You have to do fetch here
    const classID = useParams<{classID: string}>()
    console.log(classID?.classID)
    return (
        <div>
            <div className="flex items-center justify-start top-0 left-0 m-10">
                
                <ChevronLeftIcon className="h-4 w-4" color="#ADADAD"/>
                <span className="gray text-sm">Back to all classes</span>
            </div>
            {/* header */}
            <div className="flex flex-col w-3/4 mx-auto">
                <div className="m-10 w-full flex justify-between items-center flex-shrink-0 mx-auto">
                    <div className="w-full h-full flex items-center">
                        <Avatar className="h-1/6 w-1/6 mr-10">
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col justify-start">
                        <h1 className="text-3xl">Intro to Python</h1>
                            <span className="text-xs">6473338512</span>
                        </div>
                    </div>
                    <div>
                        <button>
                            <Pencil1Icon/>
                        </button>
                       
                    </div>
    
                </div>

                {/* Manage Team Members */}
                <button className="flex items-center space-x-4 text-xs gray max-w-fit">
                    <PersonIcon/> <span>Manage Class Members</span>
                </button>

                {/* Create new Project */}
                <Button className="max-w-fit mt-10">
                    <PlusIcon/><span className="mx-4">Create New Lesson</span>
                </Button>
                <Card>
                    <Table>
                        <TableCaption>A list of your recent invoices.</TableCaption>
                        <TableHeader>
                            <TableRow>
                            <TableHead className="w-[300px]">Title</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead>Submissions</TableHead>
                            <TableHead className="text-right">Published</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {invoices.map((invoice) => (
                            <TableRow key={invoice.invoice} onClick={(e) => openProject(e, invoice.invoice)}>
                                <TableCell className="font-medium">{invoice.invoice}</TableCell>
                                <TableCell>{invoice.paymentStatus}</TableCell>
                                <TableCell>{invoice.paymentMethod}</TableCell>
                                <TableCell className="text-right"><Switch /></TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                            <TableCell colSpan={3}>Total</TableCell>
                            <TableCell className="text-right">$2,500.00</TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </Card>
            </div>
            


            {/* Who's Coding? */}
        </div>
    )
}

export default ClassHome;