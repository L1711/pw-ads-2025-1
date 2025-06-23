import React from 'react'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import { DataGrid } from '@mui/x-data-grid'
import EditIcon from '@mui/icons-material/Edit'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import IconButton from '@mui/material/IconButton'
import { Link } from 'react-router-dom'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import AddCircleIcon from '@mui/icons-material/AddCircle'

import { feedbackWait, feedbackConfirm, feedbackNotify } from '../../ui/Feedback'

export default function CarsList() {
  const columns = [
    {
      field: 'brandModel',
      headerName: 'Marca / Modelo',
      width: 220,
      sortable: false,
      valueGetter: params => `${params.row.brand} ${params.row.model}`,
    },
    {
      field: 'imported',
      headerName: 'Importado',
      width: 110,
      renderCell: params => (params.value ? 'SIM' : ''),
    },
    {
      field: 'price',
      headerName: 'Preço',
      width: 140,
      // formata como moeda BR
      renderCell: params =>
        params.value?.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }) ?? '',
    },
    {
      field: '_actions',
      headerName: 'Ações',
      width: 110,
      sortable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: params => (
        <>
          <Link to={'./' + params.id}>
            <IconButton aria-label="editar">
              <EditIcon />
            </IconButton>
          </Link>

          <IconButton
            aria-label="excluir"
            onClick={() => handleDeleteButtonClick(params.id)}
          >
            <DeleteForeverIcon color="error" />
          </IconButton>
        </>
      ),
    },
  ]

 
  const [cars, setCars] = React.useState([])

  
  async function loadData() {
    feedbackWait(true)
    try {
      const res = await fetch(import.meta.env.VITE_API_BASE + '/cars')
      const data = await res.json()
      setCars(data)
    } catch (error) {
      console.error(error)
      feedbackNotify(error.message, 'error')
    } finally {
      feedbackWait(false)
    }
  }

  React.useEffect(() => {
    loadData()
  }, [])


  async function handleDeleteButtonClick(id) {
    if (await feedbackConfirm('Deseja realmente excluir este item?')) {
      feedbackWait(true)
      try {
        await fetch(import.meta.env.VITE_API_BASE + `/cars/${id}`, {
          method: 'DELETE',
        })
        loadData()
        feedbackNotify('Exclusão efetuada com sucesso.')
      } catch (error) {
        console.error(error)
        feedbackNotify('ERRO: ' + error.message, 'error')
      } finally {
        feedbackWait(false)
      }
    }
  }

  
  return (
    <>
      <Typography variant="h1" gutterBottom>
        Listagem de veículos
      </Typography>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'right',
          mb: 2,
        }}
      >
        <Link to={'./new'}>
          <Button
            variant="contained"
            size="large"
            color="secondary"
            startIcon={<AddCircleIcon />}
          >
            Novo veículo
          </Button>
        </Link>
      </Box>

      <Paper sx={{ height: 400, width: '100%' }} elevation={10}>
        <DataGrid
          rows={cars}
          columns={columns}
          getRowId={row => row.id}     // garante chave única
          initialState={{
            pagination: { paginationModel: { pageSize: 5 } },
          }}
          pageSizeOptions={[5]}
          disableRowSelectionOnClick
        />
      </Paper>
    </>
  )
}