import React, {useEffect, useState} from 'react'
import UserContext from './userContext'
import axios from 'axios'

const UserContextProvider = ({children}) =>{
    const [user,setUser] = useState(null)
    const [ready,setReady] = useState(false)
    useEffect(() => {
        if (!user) {
            axios.get('/profile', { withCredentials: true })
                .then(({ data }) => {
                    setUser(data);
                    setReady(true)
                })
                .catch((error) => {
                    console.error("Error fetching profile:", error);
                });
        }
    }, []);
    return(
        <UserContext.Provider value={{user,setUser,ready}}>
            {children}
        </UserContext.Provider>
    )

}

export default UserContextProvider