import axios from 'axios'

import { GITHUB_BASE_URL } from '@/constants'

export const GITHUB_API = axios.create({
  baseURL: GITHUB_BASE_URL,
  responseType: 'json',
})
