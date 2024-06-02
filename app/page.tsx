
import LoggedInHome from "./LoggedInHome"
import { getServerSession } from "next-auth"
import {authOptions}  from "../pages/api/auth/[...nextauth]"
import LoggedOutHome from "./LoggedOutHome"


export default async function Home() {
  const session = await getServerSession(authOptions)
  if (session) {
    return (
      <>
        <LoggedInHome/>
      </>
      
    )
  } else {
    return (
      <>
        <LoggedOutHome/>
      </>
    )
  }
}