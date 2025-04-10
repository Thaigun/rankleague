import { createFileRoute, useRouter } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  const router = useRouter()

  return (
    <h1>
        {router.basepath}
    </h1>
  )
}