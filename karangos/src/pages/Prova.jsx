import React from 'react'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Button from '@mui/material/Button'
import FavoriteIcon from '@mui/icons-material/Favorite'
import logo from '../assets/vintage-cars.png'

function MediaCard({ content, onLike, contador }) {
  return (
    <Card sx={{ maxWidth: 270 }}>
      <CardMedia
        sx={{ height: 200 }}
        image={logo}
        title="vintage-cars"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Sobre o Projeto Karangos
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {content}
        </Typography>
      </CardContent>
      <CardActions>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-around',
          width: '60%'
        }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={onLike}
          >
            <FavoriteIcon /> Curtir ({contador})
          </Button>
        </Box>
      </CardActions>
    </Card>
  );
}

export default function Prova({ initialName = '' }) {
  const [likes, setLikes] = React.useState(
    () => window.localStorage.getItem('sub') ?? initialName
  )
  const [variado, setVariado] = React.useState('')
  const [contador, setContador] = React.useState(() => {
    const stored = localStorage.getItem('contador')
    return stored ? parseInt(stored, 10) : 0
  })

  // Atualiza localStorage quando 'likes' mudar
  React.useEffect(() => {
    window.localStorage.setItem('likes', likes)
  }, [likes])

  // Atualiza localStorage quando contador mudar
  React.useEffect(() => {
    window.localStorage.setItem('contador', contador.toString())
  }, [contador])

  // Carrega dados da API uma vez ao montar
  React.useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch(import.meta.env.VITE_API_BASE + '/sobre/1')
        const data = await response.json()
        setVariado(data.info)
      } catch (error) {
        console.error(error)
      }
    }
    loadData()
  }, [])


  function handleLike() {
    setContador(cont => cont + 1)
  }

  return (
    <div>

      <Typography variant="h1" gutterBottom>
        Sobre o Projeto Karangos
      </Typography>

      
      <MediaCard content={variado} onLike={handleLike} contador={contador} />
    </div>
  )
}