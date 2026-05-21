'use client'
import { createContext, useContext } from 'react'

export const PersonCtx = createContext(null)
export const usePerson = () => useContext(PersonCtx)
