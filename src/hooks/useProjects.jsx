import { useState, useEffect } from 'react'
import * as projectsService from '../services/projectsService'

export const useProjects = () => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchProjects = async (filters = {}) => {
    try {
      setLoading(true)
      setError(null)
      const page = filters.page ?? 1
      const perPage = filters.perPage ?? 12
      const result = await projectsService.fetchProjects({
        page,
        perPage,
        featured: filters.featured,
        search: filters.search,
        technology: filters.technology,
      })
      setProjects(result.projects || [])
      return result
    } catch (err) {
      setError(err)
      return { projects: [], total: 0 }
    } finally {
      setLoading(false)
    }
  }

  const createProject = async (projectData) => {
    try {
      const project = await projectsService.createProject(projectData)
      return project
    } catch (err) {
      setError(err)
      return null
    }
  }

  const updateProject = async (id, projectData) => {
    try {
      const project = await projectsService.updateProject(id, projectData)
      return project
    } catch (err) {
      setError(err)
      return null
    }
  }

  const deleteProject = async (id) => {
    try {
      await projectsService.deleteProject(id)
      return true
    } catch (err) {
      setError(err)
      return false
    }
  }

  const toggleFeatured = async (id, featured) => updateProject(id, { featured })

  useEffect(() => {
    fetchProjects()
  }, [])

  return {
    projects,
    loading,
    error,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    toggleFeatured,
  }
}
