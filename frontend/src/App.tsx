import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import './App.css'
import { Link, Outlet, useLocation, useMatch } from 'react-router-dom'

import { useEffect } from 'react';
import { useData, useDrawer } from './store';
import { getCounts } from './api/counts';
import { getFilters } from './api/filters';
import { AppBar, Box, Button, Container, IconButton, Toolbar, Typography } from '@mui/material';
import { MenuOpen } from '@mui/icons-material'

export default function App() {
  const location = useLocation()
  const { setCounts, setFilters } = useData()
  const { open, setOpen } = useDrawer()

  useEffect(() => {
    const _getCounts = async() => {
      const counts = await getCounts()
      setCounts(counts)

      const filters = await getFilters()
      setFilters(filters)
    }

    _getCounts()
  }, []);

  const appBarButtonUnderline = {
    content: '""',
    position: 'absolute',
    bottom: 0,
    height: 2,
    width: '90%',
    borderBottom: '2px solid white'
  }

  return (
    <>
      <AppBar position='static'>
        <Container maxWidth='xl'>
          <Toolbar disableGutters>
            {useMatch('/errors') && <IconButton onClick={() => setOpen(!open)}><MenuOpen /></IconButton>}
            <Typography
              variant='h6'
              noWrap
              component='a'
              href=''
              sx={{
                mr: 2,
                fontFamily: 'monospace',
                fontWeight: 700,
                color: 'inherit',
                textDecoration: 'none',
                alignSelf: 'center',
                flexGrow: 1
              }}
              >
              ATA Exam Database
            </Typography>

            {[['/', 'Overview'], ['/errors', 'Errors']].map(([to, name], i) => (
              <Button key={'appbar-button-'+i} 
                component={Link}
                to={to}
                sx={{ 
                  my: 0, 
                  color: 'white', 
                  borderBottom: location.pathname === to ? { '&:after': appBarButtonUnderline } : null,
                  '&:hover:after': {
                    ...appBarButtonUnderline,
                    animation: 'appbar-button-hover .15s linear',
                  }
                  }} 
                  >{name}</Button>
                ))}
          </Toolbar>
        </Container>
      </AppBar>
      <section id="content">
        <Outlet></Outlet>
      </section>
    </>
  )
}