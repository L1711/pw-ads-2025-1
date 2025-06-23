import React from 'react'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import { parseISO } from 'date-fns'
import { feedbackWait, feedbackNotify, feedbackConfirm } from '../../ui/Feedback'
import { useNavigate, useParams } from 'react-router-dom'
import { InputMask } from '@react-input/mask'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'

export default function CarsForm() {
  const navigate = useNavigate()
  const params = useParams()

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: currentYear - 1950 }, (_, i) => currentYear - i)
  const colors = ['Azul', 'Branco', 'Cinza', 'Preto', 'Prata', 'Verde', 'Vermelho'].sort()

  const formDefaults = {
    brand: '',
    model: '',
    color: '',
    year_manufacture: '',
    imported: 0,
    plates: '',
    selling_price: '',
    selling_date: ''
  }

  const [state, setState] = React.useState({
    car: { ...formDefaults },
    formModified: false
  })
  const { car, formModified } = state

  React.useEffect(() => {
    if (params.id) loadData()
  }, [])

  async function loadData() {
    feedbackWait(true)
    try {
      const response = await fetch(import.meta.env.VITE_API_BASE + `/cars/${params.id}`)
      const result = await response.json()
      if (result.selling_date) result.selling_date = parseISO(result.selling_date)
      setState({ ...state, car: result })
    } catch (error) {
      console.error(error)
      feedbackNotify('ERRO: ' + error.message)
    } finally {
      feedbackWait(false)
    }
  }

  function handleFieldChange(event) {
    const { name, value } = event.target
    const carCopy = { ...car, [name]: value }
    setState({ ...state, car: carCopy, formModified: true })
  }

  async function handleFormSubmit(event) {
    event.preventDefault()
    feedbackWait(true)
    try {
      const reqOptions = {
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(car)
      }

      if (params.id) {
        await fetch(import.meta.env.VITE_API_BASE + `/cars/${params.id}`, {
          ...reqOptions,
          method: 'PUT'
        })
      } else {
        await fetch(import.meta.env.VITE_API_BASE + `/cars`, {
          ...reqOptions,
          method: 'POST'
        })
      }

      feedbackNotify('Item salvo com sucesso.', 'success', 2500, () => {
        navigate('..', { relative: 'path', replace: true })
      })
    } catch (error) {
      console.error(error)
      feedbackNotify('ERRO: ' + error.message, 'error')
    } finally {
      feedbackWait(false)
    }
  }

  async function handleBackButtonClick() {
    if (formModified && !(await feedbackConfirm('Há informações não salvas. Deseja realmente sair?'))) return
    navigate('..', { relative: 'path', replace: 'true' })
  }

  return (
    <>
      <Typography variant="h1" gutterBottom>
        Cadastro de veículos
      </Typography>

      <Box className="form-fields">
        <form onSubmit={handleFormSubmit}>

          <TextField
            variant="outlined"
            name="brand"
            label="Marca"
            fullWidth
            required
            autoFocus
            value={car.brand}
            onChange={handleFieldChange}
          />

          <TextField
            variant="outlined"
            name="model"
            label="Modelo"
            fullWidth
            required
            value={car.model}
            onChange={handleFieldChange}
          />

          <TextField
            variant="outlined"
            name="color"
            label="Cor"
            select
            fullWidth
            required
            value={car.color}
            onChange={handleFieldChange}
          >
            {colors.map(color => (
              <MenuItem key={color} value={color}>
                {color}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            variant="outlined"
            name="year_manufacture"
            label="Ano de fabricação"
            select
            fullWidth
            required
            value={car.year_manufacture}
            onChange={handleFieldChange}
          >
            {years.map(year => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </TextField>

          <div className="MuiFormControl-root">
            <FormControlLabel
              control={
                <Checkbox
                  name="imported"
                  checked={!!car.imported}
                  onChange={e =>
                    setState({
                      ...state,
                      car: { ...car, imported: e.target.checked ? 1 : 0 },
                      formModified: true
                    })
                  }
                />
              }
              label="Importado"
            />
          </div>

          <InputMask
            mask="aaa-$999"
            replacement={{
              a: /[A-Z]/,
              $: /[A-J0-9]/,
              9: /\d/
            }}
            value={car.plates}
            onChange={e =>
              handleFieldChange({ target: { name: 'plates', value: e.target.value } })
            }
          >
            {(inputProps) => (
              <TextField
                {...inputProps}
                variant="outlined"
                name="plates"
                label="Placas"
                fullWidth
                required
              />
            )}
          </InputMask>

          <TextField
            variant="outlined"
            name="selling_price"
            label="Preço de venda"
            type="number"
            fullWidth
            required
            value={car.selling_price}
            onChange={handleFieldChange}
          />

          <TextField
            variant="outlined"
            name="selling_date"
            label="Data de venda"
            fullWidth
            value={car.selling_date}
            onChange={handleFieldChange}
          />

          <Box sx={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
            <Button variant="contained" color="secondary" type="submit">
              Salvar
            </Button>
            <Button variant="outlined" onClick={handleBackButtonClick}>
              Voltar
            </Button>
          </Box>

          <Box sx={{ fontFamily: 'monospace', display: 'flex', flexDirection: 'column', width: '100vw' }}>
            {JSON.stringify(car, null, '  ')}
          </Box>
        </form>
      </Box>
    </>
  )
}