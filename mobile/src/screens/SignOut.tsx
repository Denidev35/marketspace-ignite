import { Loading } from '@components/Loading'
import { useAuth } from '@hooks/useAuth'
import { useEffect } from 'react'

export function SignOut() {
  const { signOut } = useAuth()
  useEffect(() => {
    signOut()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <Loading />
}
