import { NextPageContext } from 'next'
import Link from 'next/link'

interface ErrorProps {
  statusCode: number
  hasGetInitialPropsRun?: boolean
  err?: Error
}

function Error({ statusCode, hasGetInitialPropsRun, err }: ErrorProps) {
  if (!hasGetInitialPropsRun && err) {
    console.error('Error details:', err)
  }

  return (
    <div className="min-h-screen bg-château-dark flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-château-night/90 border border-château-border rounded-sm p-8 text-center">
        <h1 className="text-3xl font-serif text-château-parchment mb-4">
          {statusCode === 404 ? 'Page Not Found' : 'An Error Occurred'}
        </h1>
        <p className="text-château-parchment/60 mb-6">
          {statusCode === 404
            ? 'The page you are looking for does not exist.'
            : `Error ${statusCode}: ${err?.message || 'Something went wrong. Please try again later.'}`}
        </p>
        <Link 
          href="/"
          className="inline-block px-6 py-2.5 bg-château-parchment/10 text-château-parchment border border-château-parchment/20 hover:bg-château-parchment/15 transition-colors rounded-sm"
        >
          Return Home
        </Link>
      </div>
    </div>
  )
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode, hasGetInitialPropsRun: true, err }
}

export default Error