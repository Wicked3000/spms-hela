'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Mail, Loader2, Trash2, Eye, CheckCircle, MessageSquare, X } from 'lucide-react'

type Message = {
  id: number
  full_name: string
  email: string
  phone: string | null
  subject: string
  message: string
  status: 'New' | 'Read' | 'Responded'
  created_at: string
}

export default function MessagesManagementPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        if (error.message.includes('relation') || error.code === '42P01') {
          toast.error('Messages table not set up. Please run messages_setup.sql')
          setMessages([])
          setLoading(false)
          return
        }
        throw error
      }
      
      setMessages(data || [])
    } catch (error) {
      console.error('Error fetching messages:', error)
      toast.error('Failed to load messages')
      setMessages([])
    } finally {
      setLoading(false)
    }
  }

  const handleViewMessage = async (message: Message) => {
    setSelectedMessage(message)
    setShowModal(true)

    // Mark as read if it's new
    if (message.status === 'New') {
      await updateStatus(message.id, 'Read', false)
    }
  }

  const updateStatus = async (id: number, newStatus: 'New' | 'Read' | 'Responded', showToast = true) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('messages')
        .update({ status: newStatus })
        .eq('id', id)

      if (error) throw error

      if (showToast) {
        toast.success(`Message marked as ${newStatus}`)
      }
      fetchMessages()
    } catch (error) {
      console.error('Status update error:', error)
      toast.error('Failed to update status')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this message?')) return

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast.success('Message deleted successfully')
      setShowModal(false)
      setSelectedMessage(null)
      fetchMessages()
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Failed to delete message')
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      'New': 'bg-blue-500/10 text-blue-400 ring-blue-500/20',
      'Read': 'bg-yellow-500/10 text-yellow-400 ring-yellow-500/20',
      'Responded': 'bg-green-500/10 text-green-400 ring-green-500/20'
    }
    return styles[status as keyof typeof styles] || styles.New
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'New': return <Mail className="h-3 w-3" />
      case 'Read': return <Eye className="h-3 w-3" />
      case 'Responded': return <CheckCircle className="h-3 w-3" />
      default: return <Mail className="h-3 w-3" />
    }
  }

  const newMessagesCount = messages.filter(m => m.status === 'New').length

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Contact Messages</h1>
            <p className="mt-2 text-sm text-gray-400">
              View and manage messages from the contact form
            </p>
          </div>
          {newMessagesCount > 0 && (
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-400 ring-1 ring-blue-500/20">
              <Mail className="h-4 w-4" />
              {newMessagesCount} New Message{newMessagesCount !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>

      {/* Messages List */}
      <div className="rounded-xl bg-[#0F172A] ring-1 ring-white/10 overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">All Messages ({messages.length})</h2>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-green-400 mx-auto" />
            <p className="mt-4 text-sm text-gray-400">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="p-12 text-center">
            <MessageSquare className="h-12 w-12 text-gray-600 mx-auto" />
            <p className="mt-4 text-sm text-gray-400">No messages yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10">
              <thead className="bg-[#1E293B]">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Subject</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Date</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {messages.map((message) => (
                  <tr 
                    key={message.id} 
                    className={`hover:bg-white/5 cursor-pointer ${message.status === 'New' ? 'bg-blue-500/5' : ''}`}
                    onClick={() => handleViewMessage(message)}
                  >
                    <td className="px-4 py-3 text-sm">
                      <div className="font-medium text-white">{message.full_name}</div>
                      {message.phone && <div className="text-xs text-gray-500">{message.phone}</div>}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">{message.email}</td>
                    <td className="px-4 py-3 text-sm text-white max-w-xs truncate">{message.subject}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs ring-1 ${getStatusBadge(message.status)}`}>
                        {getStatusIcon(message.status)}
                        {message.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {new Date(message.created_at).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleViewMessage(message)
                        }}
                        className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Message Detail Modal */}
      {showModal && selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0F172A] rounded-xl ring-1 ring-white/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h3 className="text-lg font-semibold text-white">Message Details</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Sender Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Name</label>
                  <p className="text-white">{selectedMessage.full_name}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Email</label>
                  <p className="text-white">{selectedMessage.email}</p>
                </div>
                {selectedMessage.phone && (
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Phone</label>
                    <p className="text-white">{selectedMessage.phone}</p>
                  </div>
                )}
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Date</label>
                  <p className="text-white">
                    {new Date(selectedMessage.created_at).toLocaleString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Subject</label>
                <p className="text-white font-medium">{selectedMessage.subject}</p>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Message</label>
                <div className="bg-[#1E293B] rounded-lg p-4 ring-1 ring-white/10">
                  <p className="text-gray-300 whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Status</label>
                <div className="flex gap-2">
                  {(['New', 'Read', 'Responded'] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => updateStatus(selectedMessage.id, status)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedMessage.status === status
                          ? 'bg-green-500 text-white'
                          : 'bg-white/5 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between p-6 border-t border-white/10">
              <button
                onClick={() => handleDelete(selectedMessage.id)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors ring-1 ring-red-500/20"
              >
                <Trash2 className="h-4 w-4" />
                Delete Message
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
