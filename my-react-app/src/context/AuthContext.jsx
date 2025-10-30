import { createContext, useEffect, useState, useContext, Children } from "react"
import { supabase } from "../supabaseClient"

const AuthContext = createContext()

export const AuthContextProvider = ({children}) => {
    const [session, setSession] = useState(undefined)

    // sign up func
    const signUpNewUser = async(email, password, metadata = {}) => {
        const{data, error} = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: metadata, // for firstname, lastname, role
            }
        })

        if(error){
            console.error("Error signing up:", error)
            return {success: false, error}
        }
        return {success: true, data}
    }

    // sign in
    const signInUser = async (email, password) => {
        try{
            const {data, error} = await supabase.auth.signInWithPassword({
                email: email.toLowerCase(),
                password: password,
            })

            // handle supabase error
            if(error){
                console.error("Sign-in error:", error.message)
                return {success: false, error: error.message}
            }

            // return sucess if no error
            console.log("Sign-in Successful:", data)
            return {success: true, data} //return user data
        } catch (error){
            // handle unexpected issues
            console.error("Unexpected error during sign-in:", error.message)
            return {
                sucess: false,
                error: "An unexpected error has occured. Please try again."
            }
        }
    }

    useEffect(()=>{
        supabase.auth.getSession().then(({ data: {session} }) => {
            setSession(session)
        })

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })
    },[])

    // sign out
    async function signOut() {
        const {error} = await supabase.auth.signOut()
        if(error){
            console.error("Error signing out:", error)
        }
        return {success:true}
    }

    return(
        <AuthContext.Provider value={{session, signUpNewUser, signInUser, signOut}}>
            {children}
        </AuthContext.Provider>
    )
}

export const UserAuth = () => {
    return useContext(AuthContext)
}