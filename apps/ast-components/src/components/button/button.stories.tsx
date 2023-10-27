import type { Meta, StoryObj } from '@storybook/react-native'

import { Button } from '.'

import { Centralizer } from '@development-tools/centralizer'

export default {
  title: 'Components/Button',
  component: Button,
  decorators: [(Story) => <Centralizer>{Story()}</Centralizer>],
} as Meta

export const Default: StoryObj = {}
