// API utility functions for connecting to the backend
import { apiRequest } from './queryClient';

// Properties API
export const getProperties = async (params = {}) => {
  // Filter out any React Query internal parameters
  const cleanParams = {};
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '' && !['queryKey', 'meta', 'signal'].includes(key)) {
      cleanParams[key] = value;
    }
  }
  
  const searchParams = new URLSearchParams(cleanParams);
  const url = `/api/properties${searchParams.toString() ? `?${searchParams}` : ''}`;
  console.log('API Request URL:', url, 'Params:', cleanParams);
  
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch properties');
  return response.json();
};

export const getFeaturedProperties = async (limit = 6) => {
  const response = await fetch(`/api/properties/featured/list?limit=${limit}`);
  if (!response.ok) throw new Error('Failed to fetch featured properties');
  return response.json();
};

export const getProperty = async (id) => {
  const response = await fetch(`/api/properties/${id}`);
  if (!response.ok) throw new Error('Failed to fetch property');
  return response.json();
};

// Hero slides API
export const getHeroSlides = async () => {
  const response = await fetch('/api/hero');
  if (!response.ok) throw new Error('Failed to fetch hero slides');
  return response.json();
};

// Team members API
export const getTeamMembers = async () => {
  const response = await fetch('/api/team');
  if (!response.ok) throw new Error('Failed to fetch team members');
  return response.json();
};

export const getTeamMember = async (id) => {
  const response = await fetch(`/api/team/${id}`);
  if (!response.ok) throw new Error('Failed to fetch team member');
  return response.json();
};

// Settings API
export const getPublicSettings = async () => {
  const response = await fetch('/api/settings/public');
  if (!response.ok) throw new Error('Failed to fetch settings');
  return response.json();
};

export const getCompanyInfo = async () => {
  const response = await fetch('/api/settings/company');
  if (!response.ok) throw new Error('Failed to fetch company info');
  return response.json();
};

// Blog API (if available)
export const getBlogPosts = async (limit = 10) => {
  const response = await fetch(`/api/blog?limit=${limit}`);
  if (!response.ok) throw new Error('Failed to fetch blog posts');
  return response.json();
};

// Statistics API
export const getPropertyStats = async () => {
  const response = await fetch('/api/properties/stats/overview');
  if (!response.ok) throw new Error('Failed to fetch property stats');
  return response.json();
};