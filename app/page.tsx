
import LoggedInHome from "../components/pages/views/LoggedInHome"
import { getServerSession } from "next-auth"
import { authOptions } from "../pages/api/auth/[...nextauth]"
import LoggedOutHome from "@/components/pages/views/LoggedOutHome"


export default async function Home() {
  const session = await getServerSession(authOptions);
  if (session) {
    return (
      <>
        <LoggedInHome />
      </>

    )
  } else {
    return (
      <>
        <LoggedOutHome />
      </>
    )
  }
}