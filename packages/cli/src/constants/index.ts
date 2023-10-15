import { stringify } from "@/utils/json"

// GitHub
export const GITHUB_BASE_URL = 'https://api.github.com'
export const GITHUB_ENDPOINT_CONTENT_DIR = 'repos/lucasaugustsof/astra-ui/contents'
export const GITHUB_BRANCH_REF = 'ref=package/cli'

// Components
export const ASTRA_UI_JSON = './astra-ui.json'
export const ADD_COMPONENTS_PATH = 'components/ui'
export const ASTRA_UI_JSON_CONTENT = stringify({
  componentsPath: '',
  components: []
})

// Feedback
export const ENVIRONMENT_ERROR_REASON = 'It looks like your environment is not configured correctly. Try running the command: npx astra-ui init'
export const SERVICE_ERROR_REASON = 'An error has occurred in our service. Try again later'
