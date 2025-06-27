import React from 'react'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { useParams } from 'react-router-dom'
import { feedbackWait, feedbackNotify } from '../ui/Feedback'

export default function Prova2() {
  const { id } = useParams()
  const [prova2, setProva2] = React.useState(null)

  React.useEffect(() => {
    if (id) loadData()
  }, [id])

  async function loadData() {
    feedbackWait(true)
    try {
      const response = await fetch(
        import.meta.env.VITE_API_BASE + `/sobre/1${id}`
      )
      const result = await response.json()
      setProva2(result)
    } catch (error) {
      console.error(error)
      feedbackNotify('ERRO: ' + error.message)
    } finally {
      feedbackWait(false)
    }
  }

  return (
    <>
      <Typography variant="h1" gutterBottom>
        Sobre o projeto Karangos
      </Typography>
      <Box>
        {prova2}
      </Box>
    </>
  )
}