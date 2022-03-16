import { useRouter } from 'next/router'

export default function TrainPage() {
  const router = useRouter()

  return <div>{router.asPath}</div>
}
