// unit test case for first test scenario:
// User logs-in to account, the home page reflects the user role. 

// unit test case for first test scenario:
// User logs-in to account, the home page reflects the user role. 

import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom';
import Home from './Home'

describe('Home Component Role Reflection', () => {

  // Test 1: No Role (Logged Out)
  test('renders unauthenticated content when User is null', () => {
    // ARRANGE: Render Home with the correct prop name: User
    render(<Home User={null} />)

    // ASSERT: Check for the logged-out message
    expect(screen.getByTestId('home-page-unauthenticated')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /welcome to meditrack/i })).toBeInTheDocument()
    
    // Ensure role-specific content is NOT present
    expect(screen.queryByText(/doctor dashboard/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/patient portal/i)).not.toBeInTheDocument()
  })

  // Test 2: Patient Role
  test('renders Patient Portal content when User is "patient"', () => {
    // ARRANGE: Render Home simulating a patient login
    render(<Home User="patient" />)

    // ASSERT: Check for patient-specific heading and elements
    expect(screen.getByTestId('home-page-patient')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /patient dashboard/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /book appointment/i })).toBeInTheDocument()
    
    // Ensure doctor content is NOT present
    expect(screen.queryByText(/doctor dashboard/i)).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /view schedule/i })).not.toBeInTheDocument()
  })

  // Test 3: Doctor Role (Staff)
  test('renders Doctor Dashboard content when User is "Doctor"', () => {
    // ARRANGE: Render Home simulating a doctor login
    render(<Home User="Doctor" />)

    // ASSERT: Check for doctor-specific heading and elements
    expect(screen.getByTestId('home-page-doctor')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /doctor dashboard/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /view schedule/i })).toBeInTheDocument()
    
    // Ensure patient content is NOT present
    expect(screen.queryByText(/patient portal/i)).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /request refill/i })).not.toBeInTheDocument()
  })
})