import { stringify } from "@/utils/json"

// GitHub
export const GITHUB_BASE_URL = 'https://api.github.com'
export const GITHUB_ENDPOINT_GET_CODE = 'repos/lucasaugustsof/astra-ui/contents'

// Components
export const ASTRA_UI_JSON = './astra-ui.json'
export const ADD_COMPONENTS_PATH = 'components/ui'
export const ASTRA_UI_JSON_CONTENT = stringify({
  componentsPath: '',
  components: []
})
