'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react'

type CheckResult = {
  name: string
  status: 'checking' | 'success' | 'error' | 'pending'
  message: string
}

export default function SetupVerificationPage() {
  const [checks, setChecks] = useState<CheckResult[]>([
    { name: 'Database Table', status: 'pending', message: 'Not checked yet' },
    { name: 'Storage Bucket', status: 'pending', message: 'Not checked yet' },
    { name: 'Table Policies', status: 'pending', message: 'Not checked yet' },
    { name: 'Storage Policies', status: 'pending', message: 'Not checked yet' },
  ])
  const [running, setRunning] = useState(false)

  const updateCheck = (index: number, status: CheckResult['status'], message: string) => {
    setChecks(prev => prev.map((check, i) => 
      i === index ? { ...check, status, message } : check
    ))
  }

  const runVerification = async () => {
    setRunning(true)
    const supabase = createClient()

    // Check 1: Database Table
    updateCheck(0, 'checking', 'Checking if published_documents table exists...')
    try {
      const { error } = await supabase
        .from('published_documents')
        .select('id')
        .limit(1)

      if (error) {
        if (error.message.includes('relation') || error.code === '42P01') {
          updateCheck(0, 'error', '❌ Table does not exist. Run Step 1 SQL.')
        } else {
          updateCheck(0, 'error', `❌ Error: ${error.message}`)
        }
      } else {
        updateCheck(0, 'success', '✅ Table exists and is accessible')
      }
    } catch (error) {
      updateCheck(0, 'error', `❌ Unexpected error: ${error instanceof Error ? error.message : 'Unknown'}`)
    }

    // Check 2: Storage Bucket
    updateCheck(1, 'checking', 'Checking if publications_files bucket exists...')
    try {
      const { data: buckets, error } = await supabase.storage.listBuckets()

      if (error) {
        updateCheck(1, 'error', `❌ Error listing buckets: ${error.message}`)
      } else {
        const bucket = buckets?.find(b => b.name === 'publications_files')
        if (bucket) {
          updateCheck(1, 'success', `✅ Bucket exists (${bucket.public ? 'Public' : 'Private'})`)
        } else {
          updateCheck(1, 'error', '❌ Bucket does not exist. Create it in Step 2.')
        }
      }
    } catch (error) {
      updateCheck(1, 'error', `❌ Unexpected error: ${error instanceof Error ? error.message : 'Unknown'}`)
    }

    // Check 3: Table Policies (try to insert a test record)
    updateCheck(2, 'checking', 'Checking table RLS policies...')
    try {
      // Try to select active documents (public policy)
      const { error: selectError } = await supabase
        .from('published_documents')
        .select('*')
        .eq('status', 'Active')
        .limit(1)

      if (selectError) {
        updateCheck(2, 'error', `❌ Cannot read active documents: ${selectError.message}`)
      } else {
        updateCheck(2, 'success', '✅ Public can view active documents')
      }
    } catch (error) {
      updateCheck(2, 'error', `❌ Unexpected error: ${error instanceof Error ? error.message : 'Unknown'}`)
    }

    // Check 4: Storage Policies (try to list files)
    updateCheck(3, 'checking', 'Checking storage policies...')
    try {
      const { error } = await supabase.storage
        .from('publications_files')
        .list()

      if (error) {
        if (error.message.includes('not found')) {
          updateCheck(3, 'error', '❌ Bucket not found or no access')
        } else {
          updateCheck(3, 'error', `❌ Error: ${error.message}`)
        }
      } else {
        updateCheck(3, 'success', '✅ Storage policies configured correctly')
      }
    } catch (error) {
      updateCheck(3, 'error', `❌ Unexpected error: ${error instanceof Error ? error.message : 'Unknown'}`)
    }

    setRunning(false)
  }

  const allPassed = checks.every(check => check.status === 'success')
  const anyFailed = checks.some(check => check.status === 'error')

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-white">Publications Module Setup Verification</h1>
        <p className="mt-2 text-sm text-gray-400">
          Check if your Supabase setup is complete and working correctly
        </p>
      </div>

      {/* Run Verification Button */}
      <div className="mb-8">
        <button
          onClick={runVerification}
          disabled={running}
          className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
        >
          {running ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Running Checks...
            </>
          ) : (
            <>
              <CheckCircle className="h-5 w-5" />
              Run Verification
            </>
          )}
        </button>
      </div>

      {/* Results */}
      <div className="space-y-4 mb-8">
        {checks.map((check, index) => (
          <div
            key={check.name}
            className={`rounded-xl p-6 ring-1 ${
              check.status === 'success'
                ? 'bg-green-500/10 ring-green-500/20'
                : check.status === 'error'
                ? 'bg-red-500/10 ring-red-500/20'
                : check.status === 'checking'
                ? 'bg-blue-500/10 ring-blue-500/20'
                : 'bg-[#0F172A] ring-white/10'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                {check.status === 'checking' && <Loader2 className="h-6 w-6 text-blue-400 animate-spin" />}
                {check.status === 'success' && <CheckCircle className="h-6 w-6 text-green-400" />}
                {check.status === 'error' && <XCircle className="h-6 w-6 text-red-400" />}
                {check.status === 'pending' && <AlertCircle className="h-6 w-6 text-gray-400" />}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-1">
                  {index + 1}. {check.name}
                </h3>
                <p className={`text-sm ${
                  check.status === 'success'
                    ? 'text-green-300'
                    : check.status === 'error'
                    ? 'text-red-300'
                    : check.status === 'checking'
                    ? 'text-blue-300'
                    : 'text-gray-400'
                }`}>
                  {check.message}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      {!running && checks[0].status !== 'pending' && (
        <div className={`rounded-xl p-6 ring-1 ${
          allPassed
            ? 'bg-green-500/10 ring-green-500/20'
            : anyFailed
            ? 'bg-yellow-500/10 ring-yellow-500/20'
            : 'bg-blue-500/10 ring-blue-500/20'
        }`}>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              {allPassed ? (
                <CheckCircle className="h-8 w-8 text-green-400" />
              ) : (
                <AlertCircle className="h-8 w-8 text-yellow-400" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2">
                {allPassed ? '🎉 Setup Complete!' : '⚠️ Setup Incomplete'}
              </h3>
              {allPassed ? (
                <div className="space-y-2">
                  <p className="text-green-300">
                    All checks passed! Your Publications module is ready to use.
                  </p>
                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-green-200">Next steps:</p>
                    <ul className="text-sm text-green-200 space-y-1 ml-4">
                      <li>• Go to <code className="bg-green-900/30 px-2 py-0.5 rounded">/admin/publications</code> to upload documents</li>
                      <li>• View public page at <code className="bg-green-900/30 px-2 py-0.5 rounded">/publications</code></li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-yellow-300">
                    Some setup steps are missing. Please complete the failed checks.
                  </p>
                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-yellow-200">To fix:</p>
                    <ul className="text-sm text-yellow-200 space-y-1 ml-4">
                      <li>• Open <code className="bg-yellow-900/30 px-2 py-0.5 rounded">PUBLICATIONS_QUICK_START.md</code></li>
                      <li>• Follow the steps for failed checks</li>
                      <li>• Run verification again</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-8 rounded-xl bg-blue-500/10 p-6 ring-1 ring-blue-500/20">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-6 w-6 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-lg font-semibold text-blue-400 mb-2">Setup Instructions</h3>
            <div className="text-sm text-blue-300 space-y-2">
              <p><strong>If any check fails:</strong></p>
              <ol className="ml-4 space-y-1">
                <li>1. Open <code className="bg-blue-900/30 px-2 py-0.5 rounded">PUBLICATIONS_QUICK_START.md</code></li>
                <li>2. Follow the step that corresponds to the failed check</li>
                <li>3. Run the SQL commands in your Supabase Dashboard</li>
                <li>4. Click &ldquo;Run Verification&rdquo; again</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
