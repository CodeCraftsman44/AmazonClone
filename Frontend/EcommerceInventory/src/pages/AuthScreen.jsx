import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useApi } from '../hooks/APIHandler'
import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Tab,
    Tabs,
    TextField,
    Typography,
    Alert,
    InputAdornment,
    IconButton,
    CircularProgress,
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'

// Inline LoginForm component
const LoginForm = ({ onSuccess }) => {
    const navigate = useNavigate()
    const { callApi, loading } = useApi()

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {

    }, [navigate])

    const validate = () => {
        if (!username || !password) return 'Please fill in all required fields.'
        return ''
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        const v = validate()
        if (v) return setError(v)

        try {
            const response = await callApi({ url: 'auth/login/', method: 'POST', body: { username, password } })
            const data = response && response.data ? response.data : null
            if (data && data.access) {
                localStorage.setItem('access', data.access)
                if (data.refresh) localStorage.setItem('refresh', data.refresh)
                toast.success('Login successful!')
                navigate('/')
                if (onSuccess) onSuccess()
            } else {
                toast.error('Login failed. Please try again.')
            }
        } catch (err) {
            const msg = (err && err.response && err.response.data && (err.response.data.error || err.response.data.detail)) || err.message || 'Authentication failed.'
            setError(msg)
        }
    }

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2, mt: 1 }}>
            <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} fullWidth autoComplete="username" required />
            <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                autoComplete="current-password"
                required
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" aria-label="toggle password visibility">
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />
            {error && <Alert severity="error">{error}</Alert>}
            <Button type="submit" variant="contained" size="large" disabled={loading}>
                {loading ? (<><CircularProgress size={20} sx={{ marginRight: 1 }} /> Signing in...</>) : 'Sign in'}
            </Button>
        </Box>
    )
}

// Inline SignupForm component
const SignupForm = ({ onSuccess }) => {
    const navigate = useNavigate()
    const { callApi, loading } = useApi()

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')

    const validate = () => {
        if (!username || !email || !password || !confirmPassword) return 'Please fill in all required fields.'
        if (username.length < 3) return 'Username must be at least 3 characters.'
        const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        if (!emailOk) return 'Please enter a valid email address.'
        if (password.length < 6) return 'Password must be at least 6 characters.'
        if (password !== confirmPassword) return 'Passwords do not match.'
        return ''
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        const v = validate()
        if (v) return setError(v)

        try {
            const body = { username, password, email }
            const response = await callApi({ url: 'auth/signup/', method: 'POST', body })
            const data = response && response.data ? response.data : null
            if (data && data.access) {
                localStorage.setItem('access', data.access)
                if (data.refresh) localStorage.setItem('refresh', data.refresh)
                toast.success('Signup successful!')
                navigate('/auth')
                if (onSuccess) onSuccess()
            } else {
                toast.error('Signup failed. Please try again.')
            }
        } catch (err) {
            const msg = (err && err.response && err.response.data && (err.response.data.error || err.response.data.detail)) || err.message || 'Signup failed.'
            setError(msg)
        }
    }

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2, mt: 1 }}>
            <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} fullWidth autoComplete="username" />
            <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth autoComplete="email" required />
            <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth autoComplete="new-password" required />
            <TextField label="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} fullWidth autoComplete="new-password" required />
            {error && <Alert severity="error">{error}</Alert>}
            <Button type="submit" variant="contained" size="large" disabled={loading}>
                {loading ? (<><CircularProgress size={20} sx={{ marginRight: 1 }} /> Creating account...</>) : 'Create account'}
            </Button>
        </Box>
    )
}

const AuthScreen = () => {
    const [tab, setTab] = useState(0) // 0 = Login, 1 = Register

    return (
        <Container maxWidth="sm" sx={{ display: 'flex', alignItems: 'center', minHeight: '100vh' }}>
            <Box sx={{ width: '100%' }}>
                <Card elevation={3}>
                    <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="fullWidth">
                        <Tab label="Login" />
                        <Tab label="Register" />
                    </Tabs>
                    <CardContent>
                        <Typography variant="h5" sx={{ mb: 1 }}>
                            {tab === 1 ? 'Create your account' : 'Welcome back'}
                        </Typography>
                        {tab === 0 ? <LoginForm /> : <SignupForm />}
                    </CardContent>
                </Card>
            </Box>
        </Container>
    )
}

export default AuthScreen

