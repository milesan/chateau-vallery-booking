// Simple page without i18n dependencies to test basic functionality
export default function SimplePage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0a0a0a', 
      color: '#e8e0d0',
      padding: '40px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>
        Château de Vallery
      </h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>
        Simple test page - No i18n dependencies
      </p>
      
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Quick Links:</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '10px' }}>
            <a href="/" style={{ color: '#c4b5a0' }}>→ Home (with i18n)</a>
          </li>
          <li style={{ marginBottom: '10px' }}>
            <a href="/test" style={{ color: '#c4b5a0' }}>→ Test Page</a>
          </li>
          <li style={{ marginBottom: '10px' }}>
            <a href="/en" style={{ color: '#c4b5a0' }}>→ English Home</a>
          </li>
          <li style={{ marginBottom: '10px' }}>
            <a href="/fr" style={{ color: '#c4b5a0' }}>→ French Home</a>
          </li>
        </ul>
      </div>
      
      <div style={{ 
        padding: '20px', 
        backgroundColor: 'rgba(255,255,255,0.05)', 
        borderRadius: '8px',
        marginTop: '40px'
      }}>
        <h3 style={{ marginBottom: '10px' }}>Environment Check:</h3>
        <pre style={{ fontSize: '0.9rem' }}>
{JSON.stringify({
  NODE_ENV: process.env.NODE_ENV,
  hasStripeKey: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  timestamp: new Date().toISOString()
}, null, 2)}
        </pre>
      </div>
    </div>
  )
}