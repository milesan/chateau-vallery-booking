export default function TestPage() {
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Test Page</h1>
      <p>This is a minimal test page to check if Next.js is working correctly.</p>
      <p>If you can see this page without errors, the issue is with the main application.</p>
      <hr />
      <h2>Debug Information:</h2>
      <ul>
        <li>Node Environment: {process.env.NODE_ENV}</li>
        <li>Timestamp: {new Date().toISOString()}</li>
      </ul>
    </div>
  )
}