import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from '../App'
import { STORAGE_KEY } from '../storage'

beforeEach(() => {
  localStorage.clear()
  vi.stubGlobal('Audio', class {
    play() { return Promise.resolve() }
    pause() {}
    set currentTime(_value) {}
    set volume(_value) {}
  })
})

describe('Pet BonBazaar V2.2 release candidate', () => {
  it('navigeert tussen de hoofdschermen', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Live' }))
    expect(screen.getByRole('heading', { name: 'Live Center' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Analytics' }))
    expect(screen.getByRole('heading', { name: 'Analytics' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Studio' }))
    expect(screen.getByRole('heading', { name: 'Creator Studio' })).toBeInTheDocument()
  })

  it('bewaart gewijzigde profieldata lokaal', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Profiel' }))
    const field = screen.getByLabelText('Artiestennaam')
    fireEvent.change(field, { target: { value: 'BonBazaar Live' } })
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    expect(saved.profile.stageName).toBe('BonBazaar Live')
  })

  it('kan een project toevoegen', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Projecten' }))
    fireEvent.change(screen.getByLabelText('Projectnaam'), { target: { value: 'Nieuwe single' } })
    fireEvent.click(screen.getByRole('button', { name: 'Project toevoegen' }))
    expect(screen.getByText('Nieuwe single')).toBeInTheDocument()
  })

  it('houdt developerfuncties uit de gewone navigatie', () => {
    render(<App />)
    expect(screen.queryByRole('button', { name: 'God Mode' })).not.toBeInTheDocument()
    expect(screen.queryByRole('dialog', { name: 'devLegacy developer console' })).not.toBeInTheDocument()
  })

  it('opent +devLegacy met het woord yannis', () => {
    render(<App />)
    for (const key of 'yannis') fireEvent.keyDown(window, { key })
    expect(screen.getByRole('dialog', { name: 'devLegacy developer console' })).toBeInTheDocument()
    expect(screen.getByLabelText('Admin ID')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'God Mode is ingebouwd.' })).toBeInTheDocument()
  })

  it('opent ook tijdens typen in een invoerveld als yannis wordt getypt', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Profiel' }))
    const field = screen.getByLabelText('Artiestennaam')
    for (const key of 'yannis') fireEvent.keyDown(field, { key })
    expect(screen.getByRole('dialog', { name: 'devLegacy developer console' })).toBeInTheDocument()
  })

  it('heeft sound-instellingen vooraf ingebouwd', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Profiel' }))
    expect(screen.getByLabelText('Interfacegeluiden')).toBeChecked()
    expect(screen.getByLabelText('Sound theme')).toHaveValue('dark')
  })
})
