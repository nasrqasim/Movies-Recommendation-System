'use client'

import { useState } from 'react'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, hp: '' }), // hp is honeypot
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok || !data?.success) {
        setError(
          data?.error || 'Unable to send message right now. Please try again later.',
        )
        setSubmitted(false)
        return
      }

      setSubmitted(true)
      setFormData({ name: '', email: '', message: '' })
    } catch {
      setError('Unable to send message right now. Please check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600">
            Have questions or suggestions? We'd love to hear from you!
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mt-4"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Email</h3>
                <p className="text-gray-600">contact@aimovierec.com</p>
                <p className="text-sm text-gray-500 mt-1">We'll respond within 24 hours</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Social Media</h3>
                <div className="flex space-x-4">
                  <a 
                    href="#" 
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                    onClick={(e) => e.preventDefault()}
                  >
                    LinkedIn
                  </a>
                  <a 
                    href="#" 
                    className="text-blue-400 hover:text-blue-600 transition-colors"
                    onClick={(e) => e.preventDefault()}
                  >
                    Twitter
                  </a>
                  <a 
                    href="#" 
                    className="text-pink-600 hover:text-pink-800 transition-colors"
                    onClick={(e) => e.preventDefault()}
                  >
                    Instagram
                  </a>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Developer</h3>
                <p className="text-gray-600">Nasrullah Qasim</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send a Message</h2>
            
            {submitted ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <div className="text-green-600 text-5xl mb-4">✓</div>
                <p className="text-green-800 font-semibold">Message sent successfully!</p>
                <p className="text-green-600 text-sm mt-2">We'll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Honeypot field (hidden from users) */}
                <div className="hidden">
                  <label htmlFor="hp">Leave this field empty</label>
                  <input id="hp" name="hp" type="text" autoComplete="off" />
                </div>

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Your message here..."
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

