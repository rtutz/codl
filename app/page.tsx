/* eslint no-use-before-define: 0 */  // --> OFF
// @ts-nocheck

import LoggedInHome from "./LoggedInHome"
import { getServerSession } from "next-auth"
import {authOptions}  from "../pages/api/auth/[...nextauth]"
import LoggedOutHome from "./LoggedOutHome"


export default async function Home() {
  const session = await getServerSession(authOptions)
  console.log(session)
  console.log("this should be in terminal")
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