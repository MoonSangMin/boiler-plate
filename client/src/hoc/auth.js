import React, { useEffect } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { auth } from '../_actions/user_action'

export default function(SpecificComponent, option, adminRoute = null){
    function AuthenticationCheck(props){
        const dispatch = useDispatch()

        useEffect(() => {
            dispatch(auth()).then(response => {
                if(!response.payload.isAuth){
                    if(option){
                        props.history.push('/login')
                    }
                } else{
                    if(adminRouter && !response.payload.isAdmin){
                        props.history.push('/login')
                    } else {
                        if(option === false){
                            props.history.push('/')
                        }
                    }
                }
            })
        }, [])
        return SpecificComponent
    }

    return AuthenticationCheck
}