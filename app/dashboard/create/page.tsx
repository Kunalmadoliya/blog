'use client'

import { createBlogAction } from '@/app/actions/blog'
import RichEditor from '@/components/RichEditor'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'

export default function CreateBlogPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    tags: '',
    status: 'DRAFT' as const,
    scheduledPublishAt: '',
  })

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const tags = formData.tags
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0)

      const result = await createBlogAction({
        ...formData,
        tags,
      })

      if (result.success) {
        router.push(`/blogs/${result.slug}`)
      } else {
        setError(result.error || 'Failed to create blog')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error('[v0] Creation error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-background min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Create New Article</h1>
          <p className="text-muted-foreground">Share your thoughts and insights with the developer community</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive rounded text-destructive text-sm">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-bold mb-2">
              Article Title
            </label>
            <input
              id="title"
              type="text"
              required
              placeholder="Your article title"
              className="w-full px-4 py-3 border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary bg-background"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          {/* Content Editor */}
          <div>
            <label htmlFor="content" className="block text-sm font-bold mb-2">
              Content
            </label>
            <RichEditor
              content={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
            />
          </div>

          {/* Excerpt */}
          <div>
            <label htmlFor="excerpt" className="block text-sm font-bold mb-2">
              Excerpt (optional)
            </label>
            <textarea
              id="excerpt"
              placeholder="A short summary of your article (will be auto-generated if left empty)"
              className="w-full px-4 py-3 border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary bg-background"
              rows={3}
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            />
          </div>

          {/* Category & Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label htmlFor="category" className="block text-sm font-bold mb-2">
                Category (optional)
              </label>
              <input
                id="category"
                type="text"
                placeholder="e.g., React, Next.js, TypeScript"
                className="w-full px-4 py-3 border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary bg-background"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-bold mb-2">
                Tags (optional, comma-separated)
              </label>
              <input
                id="tags"
                type="text"
                placeholder="e.g., web-dev, coding, tutorial"
                className="w-full px-4 py-3 border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary bg-background"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              />
            </div>
          </div>

          {/* Status & Schedule */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label htmlFor="status" className="block text-sm font-bold mb-2">
                Status
              </label>
              <select
                id="status"
                className="w-full px-4 py-3 border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary bg-background"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'DRAFT' | 'PUBLISHED' | 'SCHEDULED' })}
              >
                <option value="DRAFT">Save as Draft</option>
                <option value="PUBLISHED">Publish Now</option>
                <option value="SCHEDULED">Schedule for Later</option>
              </select>
            </div>

            {formData.status === 'SCHEDULED' && (
              <div>
                <label htmlFor="scheduledPublishAt" className="block text-sm font-bold mb-2">
                  Publish Date & Time
                </label>
                <input
                  id="scheduledPublishAt"
                  type="datetime-local"
                  required
                  className="w-full px-4 py-3 border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary bg-background"
                  value={formData.scheduledPublishAt}
                  onChange={(e) => setFormData({ ...formData, scheduledPublishAt: e.target.value })}
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-8 border-t border-border">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded font-medium transition-colors"
            >
              {isLoading ? 'Publishing...' : 'Publish Article'}
            </Button>
            <Button
              type="button"
              onClick={() => router.back()}
              className="border border-border hover:bg-secondary px-8 py-3 rounded font-medium transition-colors"
              variant="outline"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
