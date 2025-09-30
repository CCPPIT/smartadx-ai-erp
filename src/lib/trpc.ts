import { initTRPC } from '@trpc/server'
import superjson from 'superjson'
import { prisma } from './prisma'

export const createContext = async () => {
  return {
    prisma,
  }
}

type Context = Awaited<ReturnType<typeof createContext>>

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape
  },
})

export const router = t.router
export const publicProcedure = t.procedure